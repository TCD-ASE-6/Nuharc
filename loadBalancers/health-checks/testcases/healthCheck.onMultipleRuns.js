'use strict'
const http = require('http')
const server = http.createServer((req, res) => res.end('server'))

const { createHealthCheckManager } = require('../index')
const SIGNAL_ARGUMENT = process.argv[2]

createHealthCheckManager(server, {
  onSignal: () => {
    console.log('on-' + SIGNAL_ARGUMENT.toLowerCase() + '-done')
    return Promise.resolve()
  },
  signal: SIGNAL_ARGUMENT,
})

server.listen(8000, () => {
  process.kill(process.pid, SIGNAL_ARGUMENT)
})