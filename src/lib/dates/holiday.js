const { DateTime } = require('luxon')
const { holidays } = require('../config/holidays')

exports.numberOfHolidays = (startDate, endDate, locale = 'america') => {
  const luxStart = DateTime.fromISO(`${startDate}T00:00:00.000Z`)
  const luxEnd = DateTime.fromISO(`${endDate}T23:59:59.999Z`)

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
  return !!holidays.find(h => +h.date === +luxDate && h.locale === locale.toLowerCase())
}