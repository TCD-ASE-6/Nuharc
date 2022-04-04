'use strict'
const http = require('http')
const server = http.createServer((req, res) => res.end('server'))

const CONSTANTS = require("../../util").CONSTANTS
const { createHealthCheckManager } = require('../index')
const SIGNAL_TERM = CONSTANTS.SIGNAL_INTERNAL

createHealthCheckManager(server, {
  beforeShutdown: () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  },
  healthChecks: {
    '/health': () => Promise.resolve()
  },
  signal: SIGNAL_TERM,
})

server.listen(8000, () => {
  process.kill(process.pid, SIGNAL_TERM)
})