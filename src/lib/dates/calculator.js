const bizniz = require('bizniz').default
const { DateTime } = require('luxon')
const { getLogger } = require('../logging/logger')
const { numberOfHolidays } = require('./holiday')

const TIME_FORMAT = "yyyy-LL-dd'T'HH:mm:ss'Z'"
const TIME_ZONE = 'UTC'

const adjustEndDateForHolidays = (startDate, endDate, locale, previousHolidayDays = 0) => {
  const holidaysDays = numberOfHolidays(startDate.toISODate(), endDate.toISODate(), locale)
  const adjustmentNeeded = holidaysDays - previousHolidayDays

  if (adjustmentNeeded > 0) {
    let newEndDate = bizniz.addWeekDays(endDate.toJSDate(), adjustmentNeeded)
    newEndDate = DateTime.fromJSDate(newEndDate).setZone(TIME_ZONE)

    // doing recursive call in case there's new holiday when we added weekdays
    return adjustEndDateForHolidays(startDate, newEndDate, locale, holidaysDays)
  }

  return endDate
}

exports.settlementDate = (initialDate, delay = 1, locale) => {
  const log = getLogger()

  log.debug('settlementDate: starting calculation', {
    params: { initialDate, delay, locale },
  })

  const luxInitDate = DateTime.fromISO(initialDate)
  if (!luxInitDate.isValid) {
    throw new Error('invalid initialDate')
  }

  if (delay < 1) {
    throw new Error('Delay should at least be 1')
  }

  const isStartDateWeekend = bizniz.isWeekendDay(luxInitDate.toJSDate())
  const weekendAdjustment = isStartDateWeekend ? 1 : 0
  const adjustedDelay = delay - 1 + weekendAdjustment // delays include the current day

  const resultDate = bizniz.addWeekDays(luxInitDate.toJSDate(), adjustedDelay)
  let luxResultDate = DateTime.fromJSDate(resultDate).setZone(TIME_ZONE)
  luxResultDate = adjustEndDateForHolidays(luxInitDate, luxResultDate, locale)

  const weekendDays = bizniz.weekendDaysBetween(luxInitDate.toJSDate(), luxResultDate.toJSDate())
  const totalDays = luxResultDate.diff(luxInitDate, 'days').days + 1 // to include current day
  const holidayDays = numberOfHolidays(luxInitDate.toISODate(), luxResultDate.toISODate(), locale)
  return {
    businessDate: luxResultDate.toFormat(TIME_FORMAT),
    totalDays,
    weekendDays,
    holidayDays,
  }
}
