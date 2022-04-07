'use strict'
const http = require('http')

const { createHealthCheckManager } = require('../index')
const CONSTANTS = require("../../util").CONSTANTS
const SIGNAL_PROCESS = CONSTANTS.SIGNAL_INTERNAL
const server = http.createServer((req, res) => res.end('server'))

createHealthCheckManager(server, {
  beforeShutdown: () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  },
  signal: SIGNAL_PROCESS,
  healthChecks: {
    '/health': ({ state }) => Promise.resolve({ state })
  },
  sendFailuresWithShutdown: false,
})

server.listen(8000, () => {
  process.kill(process.pid, SIGNAL_PROCESS)
})