const { DateTime } = require('luxon')
const { getLogger } = require('../logging/logger')
const { holidays } = require('../config/holidays')

exports.numberOfHolidays = (startDate, endDate, locale = 'america') => {
  const log = getLogger()
  const luxStart = DateTime.fromISO(`${startDate}T00:00:00.000Z`)
  const luxEnd = DateTime.fromISO(`${endDate}T23:59:59.999Z`)

  if (!luxStart.isValid || !luxEnd.isValid) {
    throw new Error('invalid date start or end date')
  }

  log.debug('numberOfHolidays: starting counting of holidays', {
    params: { startDate, endDate, locale },
  })

  return holidays.reduce((total, holiday) => {
    if (luxStart <= holiday.date && luxEnd >= holiday.date
      && holiday.locale === locale.toLowerCase()) {
      return total + 1
    }

    return total
  }, 0)
}

exports.isDateHoliday = (date, locale = 'america') => {
  const luxDate = DateTime.fromISO(`${date}T00:00:00Z`)
  if (!luxDate.isValid) {
    throw new Error('invalid date')
  }

  return !!holidays.find((h) => +h.date === +luxDate && h.locale === locale.toLowerCase())
}

exports.isDateBusinessDay = (date, locale = 'america') => {
  const luxDate = DateTime.fromISO(`${date}T00:00:00Z`)
  if (!luxDate.isValid) {
    throw new Error('invalid date')
  }

  return luxDate.weekday <= 5 && !this.isDateHoliday(date, locale)
}
