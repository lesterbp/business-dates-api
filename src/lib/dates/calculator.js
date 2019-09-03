const bizniz = require('bizniz').default
const { DateTime } = require('luxon')
const { getLogger } = require('../logging/logger')
const { holidays } = require('../config/holidays')

const TIME_FORMAT = "yyyy-LL-dd'T'HH:mm:ss'Z'"
const TIME_ZONE = 'UTC'

const numberOfHolidays = (startDate, endDate, locale = 'america') => {
  const adjustedStart = DateTime.fromISO(startDate.toISODate())
  return holidays.reduce((total, holiday) => {
    if (adjustedStart <= holiday.date && endDate >= holiday.date
      && holiday.locale === locale.toLowerCase()) {
      return total + 1
    }
  
    return total
  }, 0)
}

const adjustDateForHolidays = (startDate, endDate, previousHolidayDays = 0) => {
  const holidaysDays = numberOfHolidays(startDate, endDate)
  const adjustmentNeeded = holidaysDays - previousHolidayDays

  if (adjustmentNeeded > 0) {
    let newEndDate = bizniz.addWeekDays(endDate.toJSDate(), adjustmentNeeded)
    newEndDate = DateTime.fromJSDate(newEndDate).setZone(TIME_ZONE)

    // doing recursive call in case there's new holiday when we added weekdays
    return adjustDateForHolidays(startDate, newEndDate, holidaysDays)
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
    luxResultDate = adjustDateForHolidays(luxInitDate, luxResultDate)

    const weekendDays = bizniz.weekendDaysBetween(luxInitDate.toJSDate(), luxResultDate.toJSDate())
    const totalDays = luxResultDate.diff(luxInitDate, 'days').days + 1 // to include current day
    const holidayDays = numberOfHolidays(luxInitDate, luxResultDate)
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
