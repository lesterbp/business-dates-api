const { getLogger } = require('../logging/logger')
const { formatResponse } = require('../formatters/response')
const { settlementDate } = require('../dates/calculator')
const { isDateBusinessDay } = require('../dates/holiday')

exports.processSettlementDate = (pubSub, data) => {
  const log = getLogger()
  const { messageId, initialDate, delay, locale } = data
  let processResult

  try {
    const result = settlementDate(initialDate, delay, locale)
    processResult = formatResponse({
      initialDate, delay, locale,
    }, result)
  } catch (e) {
    log.error('pubSub:processSettlementDate: encountered error', { errorMessage: e.message })

    processResult = formatResponse({
      initialDate, delay, locale,
    }, null, e.message)
  }

  pubSub.publish('businessDates.getBusinessDateWithDelay.response', {
    messageId,
    ...processResult
  })
}

exports.processIsDateBusinessDay = (pubSub, data) => {
  const log = getLogger()
  const { messageId, date, locale } = data
  let processResult

  try {
    const result = isDateBusinessDay(date, locale)
    processResult = formatResponse({
      date, locale,
    }, result)
  } catch (e) {
    log.error('pubSub:processIsDateBusinessDay: encountered error', { errorMessage: e.message })

    statusCode = 404
    processResult = formatResponse({
      date, locale,
    }, null, e.message)
  }

  pubSub.publish('businessDates.isDateBusinessDay.response', {
    messageId,
    ...processResult
  })
}
