'use strict'
const http = require('http')
const server = http.createServer((req, res) => res.end('server'))

const { createHealthCheckManager } = require('../index')
const CONSTANTS = require("../../util").CONSTANTS

createHealthCheckManager(server, {
  healthChecks: {
    '/health': () => Promise.resolve()
  },
  sendFailuresWithShutdown: false,
  onSendFailureWithShutdown: async () => {
    console.log('onSendingFailed')
  },
  beforeShutdown: () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }
})

server.listen(8000, () => {
  process.kill(process.pid, CONSTANTS.SIGNAL_TERMINATE)
})