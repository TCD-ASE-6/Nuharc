'use strict'
const http = require('http')
const CONSTANTS = require("../../util").CONSTANTS

const server1 = http.createServer((req, res) => res.end('server1'))
const server2 = http.createServer((req, res) => res.end('server2'))
const server3 = http.createServer((req, res) => res.end('server3'))

const { createHealthCheckManager } = require('../index')

createHealthCheckManager(server1, {
  onSignal: () => {
    console.log('server1 onSignal running')
    return Promise.resolve()
  }
})
createHealthCheckManager(server2, {
  onSignal: () => {
    console.log('server2 onSignal running')
    return Promise.resolve()
  }
})
createHealthCheckManager(server3, {
  onSignal: () => {
    console.log('server3 onSignal running')
    return Promise.resolve()
  }
})

new Promise((resolve) => {
  let ctr = 3
  const handleProcess = () => {
    ctr -= 1
    if (ctr <= 0) { resolve() }
  }
  server1.listen(8000, handleProcess)
  server2.listen(8001, handleProcess)
  server3.listen(8002, handleProcess)
})
  .then(() => process.kill(process.pid, CONSTANTS.SIGNAL_TERMINATE))