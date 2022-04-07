'use strict'
const http = require('http')
const server = http.createServer((req, res) => res.end('server'))

const { createHealthCheckManager } = require('../index')
const CONSTANTS = require("../../util").CONSTANTS

createHealthCheckManager(server, {
  onSignal: () => {
    console.log('on-signal-terminate')
    return Promise.resolve()
  }
})

server.listen(8000, () => {
  process.kill(process.pid, CONSTANTS.SIGNAL_TERMINATE)
})