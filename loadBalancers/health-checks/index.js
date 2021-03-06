const { promisify } = require('util')
const stoppable = require('stoppable')
const CONSTANTS = require("../util").CONSTANTS

/**
 * dummy resolver initialised for resolving promise
 * @returns void
 */
function dummyResolver () {
  return Promise.resolve()
}

/**
 * sending success as JSON to server
 * @param {*} res 
 * @param {*} param1 
 * @returns 
 */
async function sendSuccessResponse (res, { info, extensive, statusSuccess, headers }) {
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(statusSuccess, headers)
  if (info) {
    return res.end(
      JSON.stringify(
        Object.assign(
          {
            status: 'ok'
          },
          extensive ? info : { info, details: info }
        )
      )
    )
  }
  res.end(JSON.stringify({
    status: 'ok'
  }))
}

/**
 * Send failure response if server fails healthchecks
 * @param {*} res 
 * @param {*} options 
 */

async function sendFailureResponse (res, options) {
  const { error, headers, onSendFailureWithShutdown, showStackStraces, statusCode, statusError } = options

  const replaceErrors = (_, value) => {
    if (value instanceof Error) {
      const err = {}
      Object.getOwnPropertyNames(value).forEach((key) => {
        if (showStackStraces !== true && key === 'stack') {
          return
        }
        err[key] = value[key]
      })
      return err
    }
    return value
  }

  // Callback for failure during shutdown
  if (onSendFailureWithShutdown) {
    await onSendFailureWithShutdown()
  }
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(statusCode || statusError, headers)
  if (error) {
    return res.end(JSON.stringify({
      status: 'error',
      error: error,
      details: error
    }, replaceErrors))
  }
  res.end(JSON.stringify({
    status: 'error'
  }))
}

const startingState = {
  isServerShuttingDown: false
}

/**
 * Dummy method for setting initial state
 */
function dummy () {}


function wrapWithHealthChecks (server, state, opts) {
  const { headers, healthChecks, logging, statusError, onSendFailureWithShutdown, sendFailuresWithShutdown, statusSuccess} = opts

  let isHandlerEnabled = false
  const handler = (listener) => {
    const checkListeners = isHandlerEnabled
      ? () => {}
      : async (healthCheckCallback, response) => {
        if (state.isServerShuttingDown && sendFailuresWithShutdown) {
          return sendFailureResponse(response, { onSendFailureWithShutdown, statusError })
        }
        let info
        try {
          info = await healthCheckCallback({ state })
        } catch (error) {
          logging('healthcheck process has failed', error)
          return sendFailureResponse(
            response,
            {
              error: error.causes,
              headers,
              showStackStraces: healthChecks.__unsafeExposeStackTraces,
              statusCode: error.statusCode,
              statusError
            }
          )
        }
        return sendSuccessResponse(
          response,
          { info, verbatim: healthChecks.verbatim, statusSuccess, headers }
        )
      }

    isHandlerEnabled = true

    return async (req, res) => {
      const url = req.url
      const healthCheckCallback = healthChecks[url]

      if (healthCheckCallback) {
        return checkListeners(healthCheckCallback, res)
      } else {
        listener(req, res)
      }
    }
  }

  /**
   * Addding the listener request for callback
   */
  server.listeners('request').forEach((listener) => {
    server.removeListener('request', listener)
    server.on('request', handler(listener))
  })
}

/**
 * Wraps s
 * @param {*} server 
 * @param {*} state 
 * @param {*} opts 
 */
function wrapWithSignalHandler (server, state, opts) {
  const { signals, onSignal, beforeServerShutdown, onServerShutdown, timeout, logging } = opts

  stoppable(server, timeout)

  const asyncStopServerCallback = promisify(server.stop).bind(server)

  async function cleanup (signal) {
    if (!state.isServerShuttingDown) {
      state.isServerShuttingDown = true
      try {
        // Callback for beforeServerShutdown
        await beforeServerShutdown()
        // Callback for onSignal
        await onSignal()
        // Callback for onServerShutdown
        await onServerShutdown()
        // Callback for asyncserver stip
        await asyncStopServerCallback()
        signals.forEach(sig => process.removeListener(sig, cleanup))
        process.kill(process.pid, signal)
      } catch (error) {
        logging('Error occured during shutdown', error)
        process.exit(1)
      }
    }
  }
  signals.forEach(
    sig => process.on(sig, cleanup)
  )
}

function healthCheckManager (server, opts = {}) {
  const {
    signals = [],
    timeout = 1000,
    onServerShutdown = dummyResolver,
    beforeServerShutdown = dummyResolver,
    healthChecks = {},
    sendFailuresWithShutdown = true,
    onSendFailureWithShutdown,
    signal = CONSTANTS.SIGNAL_TERMINATE,
    logging = dummy,
    statusSuccess = 200,
    statusError = 500,
    headers = opts.headers || {}
  } = opts
  const onSignal = opts.onSignal || opts.onSigterm || dummyResolver
  const actualState = Object.assign({}, startingState)

  if (Object.keys(healthChecks).length > 0) {
    wrapWithHealthChecks(server, actualState, {
      healthChecks,
      logging,
      sendFailuresWithShutdown,
      onSendFailureWithShutdown,
      statusSuccess,
      statusError,
      headers
    })
  }

// Ensuring backwards compatibility for signals
  if (!signals.includes(signal)) {
    signals.push(signal)
  }
  wrapWithSignalHandler(server, actualState, {
    signals,
    onSignal,
    beforeServerShutdown,
    onServerShutdown,
    timeout,
    logging,
    headers
  })

  return server
}

module.exports = {
  createHealthCheckManager : healthCheckManager
}