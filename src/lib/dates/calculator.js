const bizniz = require('bizniz').default
const { DateTime } = require('luxon')
const { getLogger } = require('../logging/logger')
const { numberOfHolidays } = require('./holiday')

const TIME_FORMAT = "yyyy-LL-dd'T'HH:mm:ss'Z'"
const TIME_ZONE = 'UTC'

const adjustEndDateForHolidays = (startDate, endDate, previousHolidayDays = 0) => {
  const holidaysDays = numberOfHolidays(startDate.toISODate(), endDate.toISODate())
  const adjustmentNeeded = holidaysDays - previousHolidayDays

  if (adjustmentNeeded > 0) {
    let newEndDate = bizniz.addWeekDays(endDate.toJSDate(), adjustmentNeeded)
    newEndDate = DateTime.fromJSDate(newEndDate).setZone(TIME_ZONE)

    // doing recursive call in case there's new holiday when we added weekdays
    return adjustEndDateForHolidays(startDate, newEndDate, holidaysDays)
  }

  return endDate
}

exports.settlementDate = (initialDate, delay = 0) => {
  const log = getLogger()

  try {
    log.debug('settlementDate: starting calculation', {
      params: { initialDate, delay },
    })

    const luxInitDate = DateTime.fromISO(initialDate)
    if (!luxInitDate.isValid) {
      throw new Error('invalid initialDate')
    }

    const isStartDateWeekend = bizniz.isWeekendDay(luxInitDate.toJSDate())
    const weekendAdjustment = isStartDateWeekend ? 1 : 0
    const adjustedDelay = delay - 1 + weekendAdjustment // delays include the current day

    const resultDate = bizniz.addWeekDays(luxInitDate.toJSDate(), adjustedDelay)
    let luxResultDate = DateTime.fromJSDate(resultDate).setZone(TIME_ZONE)
    luxResultDate = adjustEndDateForHolidays(luxInitDate, luxResultDate)

    const weekendDays = bizniz.weekendDaysBetween(luxInitDate.toJSDate(), luxResultDate.toJSDate())
    const totalDays = luxResultDate.diff(luxInitDate, 'days').days + 1 // to include current day
    const holidayDays = numberOfHolidays(luxInitDate.toISODate(), luxResultDate.toISODate())
    return {
      businessDate: luxResultDate.toFormat(TIME_FORMAT),
      totalDays,
      weekendDays,
      holidayDays,
    }
  } catch (e) {
    log.error('settlementDate: encountered error, returning null', { errorMessage: e.message })
    return null
  }
}