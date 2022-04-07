'use strict'
const http = require('http')
const server = http.createServer((req, res) => res.end('server'))

const { createHealthCheckManager } = require('../index')
const CONSTANTS = require("../../util").CONSTANTS

createHealthCheckManager(server, {
  healthChecks: {
    '/healthInfo': () => Promise.reject(new Error('failure'))
  },
  onSendFailureWithShutdown: async () => {
    console.log('onSendFailureWithShutdown')
  }
})

server.listen(8000, () => {
  setTimeout(() => process.kill(process.pid, CONSTANTS.SIGNAL_TERMINATE), 600)
})