const { getLogger } = require('../logging/logger')
const { formatResponse } = require('../formatters/response')
const { settlementDate } = require('../dates/calculator')
const { isDateBusinessDay } = require('../dates/holiday')

exports.processSettlementDate = (req, res) => {
  const log = getLogger()
  const paramSource = req.method === 'GET' ? req.params : req.body
  const { initialDate, delay, locale } = paramSource
  let processResult
  let statusCode = 200

  try {
    const result = settlementDate(initialDate, delay, locale)
    processResult = formatResponse({
      initialDate, delay, locale,
    }, result)
  } catch (e) {
    log.error('processSettlementDate: encountered error', { errorMessage: e.message })

    statusCode = 404
    processResult = formatResponse({
      initialDate, delay, locale,
    }, null, e.message)
  }

  res.status(statusCode).json(processResult)
}

exports.processIsDateBusinessDay = (req, res) => {
  const log = getLogger()
  const paramSource = req.method === 'GET' ? req.params : req.body
  const { date, locale } = paramSource
  let processResult
  let statusCode = 200

  try {
    const result = isDateBusinessDay(date, locale)
    processResult = formatResponse({
      date, locale,
    }, result)
  } catch (e) {
    log.error('processIsDateBusinessDay: encountered error', { errorMessage: e.message })

    statusCode = 404
    processResult = formatResponse({
      date, locale,
    }, null, e.message)
  }

  res.status(statusCode).json(processResult)
}
