'use strict'
const http = require('http')

const expect = require('chai').expect
const { execFile, spawnSync } = require('child_process')
const fetch = require('node-fetch')

const { createHealthCheckManager } = require('./index')
const CONSTANTS = require("../util").CONSTANTS

process.setMaxListeners(100) // Removes node's built in max listeners warning while we're testing

const isContentTypeJSONPresent = (response) => {
  expect(response.headers.has('Content-Type')).to.eql(true)
  expect(response.headers.get('Content-Type')).to.eql('application/json')
}

describe('HealthCheck Manager', () => {
  let server

  beforeEach(() => {
    server = http.createServer((req, res) => res.end('server'))
  })

  afterEach(() => {
    server.close()
  })

  describe('enabling healthcheck route', () => {
    it('ensuring all other endpoints are safe', async () => {
      createHealthCheckManager(server, {})
      server.listen(8000)

      const response = await fetch('http://localhost:8000')
      const text = await response.text()
      expect(text).to.eql('server')
    })

    it('returns 200 status code on resolving', async () => {
      let hasHealthCheckExecuted = false

      createHealthCheckManager(server, {
        healthChecks: {
          '/health': () => {
            hasHealthCheckExecuted = true
            return Promise.resolve()
          }
        }
      })
      server.listen(8000)

      const response = await fetch('http://localhost:8000/health')
      expect(response.status).to.eql(200)
      expect(response.headers.has('Content-Type')).to.eql(true)
      expect(response.headers.get('Content-Type')).to.eql('application/json')
      expect(hasHealthCheckExecuted).to.eql(true)
    })

    it('returns custom status code on resolve', async () => {
      let hasHealthCheckExecuted = false

      createHealthCheckManager(server, {
        healthChecks: {
          '/healthInfo': () => {
            hasHealthCheckExecuted = true
            return Promise.resolve()
          }
        },
        statusSuccess: 200
      })
      server.listen(8000)

      const response = await fetch('http://localhost:8000/healthInfo')
      expect(response.status).to.eql(200)
      expect(response.headers.has('Content-Type')).to.eql(true)
      expect(response.headers.get('Content-Type')).to.eql('application/json')
      expect(hasHealthCheckExecuted).to.eql(true)
    })

    it('case insensitive initially', async () => {
      let hasHealthCheckExecuted = false

      createHealthCheckManager(server, {
        healthChecks: {
          '/healtTHinfo': () => {
            hasHealthCheckExecuted = true
            return Promise.resolve()
          }
        }
      })
      server.listen(8000)

      await fetch('http://localhost:8000/healthInfo')
      expect(hasHealthCheckExecuted).to.eql(false)
    })

    it('should not send multiple responses for the same request', async () => {
      let healthCheckRanTimes = 0
      let hasHandlerBeenCalled = false
      let hasUnhandledRejectionPresent = false

      process.once('unhandledRejection', () => {
        hasUnhandledRejectionPresent = true
      })

      server.on('request', () => {
        hasHandlerBeenCalled = true
      })

      createHealthCheckManager(server, {
        healthChecks: {
          '/healthCheck': () => {
            healthCheckRanTimes++
            return Promise.resolve()
          }
        }
      })
      server.listen(8000)

      await fetch('http://localhost:8000/healthCheck')
      expect(hasUnhandledRejectionPresent).to.eql(false)
      expect(healthCheckRanTimes).to.eql(1)
      expect(hasHandlerBeenCalled).to.eql(false)
    })

    it('includes information on resolve', async () => {
      let hasHealthCheckExecuted = false

      createHealthCheckManager(server, {
        healthChecks: {
          '/healthInfo': () => {
            hasHealthCheckExecuted = true
            return Promise.resolve({
              version: '1.0.0'
            })
          }
        }
      })
      server.listen(8000)

      const res = await fetch('http://localhost:8000/healthInfo')
      expect(res.status).to.eql(200)
      expect(res.headers.has('Content-Type')).to.eql(true)
      expect(res.headers.get('Content-Type')).to.eql('application/json')
      expect(hasHealthCheckExecuted).to.eql(true)
      const json = await res.json()
      expect(json).to.deep.eql({
        status: 'ok',
        info: {
          version: '1.0.0'
        },
        details: {
          version: '1.0.0'
        }
      })
    })

    it('returns 500 on reject', async () => {
      let hasHealthCheckExecuted = false
      let hasLoggerRan = false

      createHealthCheckManager(server, {
        logging: () => {
          hasLoggerRan = true
        },
        healthChecks: {
          '/healthInfo': () => {
            hasHealthCheckExecuted = true
            return Promise.reject(new Error('failed'))
          }
        },
      })
      server.listen(8000)

      const res = await fetch('http://localhost:8000/healthInfo')
      expect(res.status).to.eql(500)
      expect(hasHealthCheckExecuted).to.eql(true)
      expect(hasLoggerRan).to.eql(true)
    })

    it('returns global error status code when promise is rejected', async () => {
      let hasHealthCheckExecuted = false
      let hasLoggerRan = false

      createHealthCheckManager(server, {
        logging: () => {
          hasLoggerRan = true
        },
        statusError: 500,
        healthChecks: {
          '/healthInfo': () => {
            hasHealthCheckExecuted = true
            const error = new Error()
            return Promise.reject(error)
          }
        },
      })
      server.listen(8000)

      const res = await fetch('http://localhost:8000/healthInfo')
      expect(res.status).to.eql(500)
      expect(hasHealthCheckExecuted).to.eql(true)
      expect(hasLoggerRan).to.eql(true)
    })

    it('returns custom status code when promise is rejected', async () => {
      let hasHealthCheckExecuted = false
      let hasLoggerRan = false

      createHealthCheckManager(server, {
        healthChecks: {
          '/healthInfo': () => {
            hasHealthCheckExecuted = true
            const error = new Error()
            error.statusCode = 500
            return Promise.reject(error)
          }
        },
        logging: () => {
          hasLoggerRan = true
        }
      })
      server.listen(8000)

      const res = await fetch('http://localhost:8000/healthInfo')
      expect(res.status).to.eql(500)
      expect(hasHealthCheckExecuted).to.eql(true)
      expect(hasLoggerRan).to.eql(true)
    })

    it('returns custom status code owhen promis is rejected (prevailing over global status code)', async () => {
      let hasHealthCheckExecuted = false
      let hasLoggerRan = false

      createHealthCheckManager(server, {
        healthChecks: {
          '/healthInfo': () => {
            hasHealthCheckExecuted = true
            const error = new Error()
            error.statusCode = 501
            return Promise.reject(error)
          }
        },
        logging: () => {
          hasLoggerRan = true
        },
        statusError: 501
      })
      server.listen(8000)

      const res = await fetch('http://localhost:8000/healthInfo')
      expect(res.status).to.eql(501)
      expect(hasHealthCheckExecuted).to.eql(true)
      expect(hasLoggerRan).to.eql(true)
    })

    it('Exposes internal state to health check', async () => {
      let hasHealthCheckExecuted = false
      let internalState

      createHealthCheckManager(server, {
        healthChecks: {
          '/healthInfo': ({ state }) => {
            hasHealthCheckExecuted = true
            internalState = state
            return Promise.resolve()
          }
        }
      })
      server.listen(8000)

      const response = await fetch('http://localhost:8000/healthInfo')
      expect(response.status).to.eql(200)
      expect(response.headers.has('Content-Type')).to.eql(true)
      expect(response.headers.get('Content-Type')).to.eql('application/json')
      expect(hasHealthCheckExecuted).to.eql(true)
      expect(internalState).to.eql({ isShuttingDown: false })
    })

    it('exposes "isShuttingDown" when shutting down', (done) => {
      let responseAsserted = false
      let internalState

      execFile('node', ['loadBalancers/health-checks/testcases/healthCheck.onSignalNoFail.js'], (error) => {
        expect(error.signal).to.eql(CONSTANTS.SIGNAL_INTERNAL)
        expect(responseAsserted).to.eql(true)
        expect(internalState).to.eql({ isShuttingDown: true })
        done()
      })

      setTimeout(() => {
        fetch('http://localhost:8000/health')
          .then(async (res) => {
            expect(res.status).to.eql(200)
            responseAsserted = true
            const json = await res.json()
            internalState = json.info.state
          })
      }, 300)
    })

    it('returns 503 once termination signal is received', (done) => {
      let responseAsserted = false

      execFile('node', ['loadBalancers/health-checks/testcases/healthCheck.onSigIntFail.js'], (error) => {
        expect(error.signal).to.eql(CONSTANTS.SIGNAL_INTERNAL)
        done()
      })

      setTimeout(() => {
        fetch('http://localhost:8000/health')
          .then(res => {
            expect(res.status).to.eql(503)
            responseAsserted = true
          })
      }, 300)
    })
  })

  it('does not return 503 if `sendFailuresWithShutdown` is `false`', (done) => {
    let responseAsserted = false

    execFile('node', ['loadBalancers/health-checks/testcases/healthCheck.onSignalNoFail.js'], (error) => {
      console.log("Error....", error)
      expect(error.signal).to.eql(CONSTANTS.SIGNAL_INTERNAL)
      expect(responseAsserted).to.eql(true)
      done()
    })
    setTimeout(() => {
      fetch('http://localhost:8000/health')
        .then(res => {
          expect(res.status).to.eql(200)
          responseAsserted = true
        })
    }, 300)
  })

  it('does not call callback onSendFailureWithShutdown if `sendFailuresWithShutdown` is `false`', (done) => {
    let responseAsserted = false

    execFile('node', ['loadBalancers/health-checks/testcases/healthCheck.onNoFailuresDuringShutdown.js'],
      (error, stdout) => {
        expect(error.signal).to.eql(CONSTANTS.SIGNAL_TERMINATE)
        expect(stdout).to.eql('')
        expect(responseAsserted).to.eql(true)
        done()
      })
    setTimeout(() => {
      fetch('http://localhost:8000/health')
        .then(res => {
          expect(res.status).to.eql(200)
          responseAsserted = true
        })
    }, 300)
  })

  it('runs onSignal when gets the SIGNAL_TERMINAL signal', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onSignalTerminate.js'])
    expect(result.stdout.toString().trim()).to.eql('on-signal-terminate')
  })

  it('runs onShutdown after SIGNAL_TERMINAL onSignal', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onShutdownSigterm.js'])
    expect(result.stdout.toString().trim()).to.eql('on-signal-terminate-runs\non-shutdown-runs')
  })

  it('runs onSignal when killed with SIGNAL_TERMINAL and different signals are listened for', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onMultipleRuns.js', CONSTANTS.SIGNAL_TERMINATE])
    expect(result.stdout.toString().trim()).to.eql('on-sigterm-done')
  })

  it('runs onSignal when killed with SIGNAL_INTERNAL and different signals are listened for', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onMultipleRuns.js', CONSTANTS.SIGNAL_INTERNAL])
    expect(result.stdout.toString().trim()).to.eql('on-sigint-done')
  })

  it('runs onShutdown after onSignal when SIGNAL_TERMINAL is sentand different signals are listened for', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onShutdown.onMultiple.js', CONSTANTS.SIGNAL_TERMINATE])
    expect(result.stdout.toString().trim()).to.eql('on-sigterm-done\non-shutdown-executed')
  })

  it('runs onShutdown after onSignal when SIGNAL_INTERNAL is sent and different signals are listened for', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onShutdown.onMultiple.js', CONSTANTS.SIGNAL_INTERNAL])
    expect(result.stdout.toString().trim()).to.eql('on-sigint-done\non-shutdown-executed')
  })

  it('can manage multiple servers', () => {
    const result = spawnSync('node', ['loadBalancers/health-checks/testcases/healthCheck.onMultipleServer.js'])
    expect(result.stdout.toString().trim()).to.eql([
      'server1 onSignal running',
      'server2 onSignal running',
      'server3 onSignal running'
    ].join('\n'))
  })

  it('also accepts custom headers as inputs', async () => {
  
  createHealthCheckManager(server, {
    healthChecks: {
      '/healthInfo': () => {
        return Promise.resolve()
      }
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
  server.listen(8000)

  const res = await fetch('http://localhost:8000/healthInfo')
  expect(res.status).to.eql(200)
  expect(res.headers.has('Access-Control-Allow-Origin')).to.eql(true)
  expect(res.headers.get('Access-Control-Allow-Origin')).to.eql('*')
  })
})