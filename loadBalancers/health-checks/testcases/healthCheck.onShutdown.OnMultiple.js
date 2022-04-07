'use strict'
const http = require('http')
const server = http.createServer((req, res) => res.end('server'))

const { createHealthCheckManager } = require('../index')
const CONSTANTS = require("../../util").CONSTANTS

const SIGNALS_LIST = [CONSTANTS.SIGNAL_USER, CONSTANTS.SIGNAL_INTERNAL, CONSTANTS.SIGNAL_TERMINATE]
const SIGNAL_TERM = process.argv[2]

createHealthCheckManager(server, {
  signals: SIGNALS_LIST,
  onSignal: () => {
    console.log('on-' + SIGNAL_TERM.toLowerCase() + '-done')
    return Promise.resolve()
  },
  onShutdown: () => {
    console.log('on-shutdown-executed')
  }
})

server.listen(8000, () => {
  process.kill(process.pid, SIGNAL_TERM)
})