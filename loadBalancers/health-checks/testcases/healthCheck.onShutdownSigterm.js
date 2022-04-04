'use strict'
const http = require('http')
const CONSTANTS = require("../../util").CONSTANTS
const server = http.createServer((req, res) => res.end('server'))

const { createHealthCheckManager } = require('../index')

createHealthCheckManager(server, {
  onSignal: () => {
    console.log('on-signal-terminate-runs')
    return Promise.resolve()
  },
  onShutdown: () => {
    console.log('on-shutdown-runs')
  }
})

server.listen(8000, () => {
  process.kill(process.pid, CONSTANTS.SIGNAL_TERMINATE)
})