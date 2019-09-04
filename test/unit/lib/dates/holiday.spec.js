const { describe, it } = require('mocha')
const { expect } = require('chai')
const { getLogger } = require('../../../../src/lib/logging/logger')
const { numberOfHolidays, isDateHoliday } = require('../../../../src/lib/dates/holiday')

getLogger({ level: 'error' }) // only log errors

describe('#numberOfHolidays', () => {
  it('returns 1 holiday with same start date and end date', () => {
    const result = numberOfHolidays('2018-01-15', '2018-01-15')
    expect(result).to.be.equal(1)
  })

  it('returns 1 holiday with range of start date and end date', () => {
    const result = numberOfHolidays('2018-01-14', '2018-01-17')
    expect(result).to.be.equal(1)
  })

  it('returns 3 holiday with range of start date and end date', () => {
    const result = numberOfHolidays('2018-01-01', '2018-02-19')
    expect(result).to.be.equal(3)
  })
})

describe('#numberOfHolidays', () => {
  it('returns true if holiday', () => {
    const result = isDateHoliday('2018-01-15')
    expect(result).to.be.true
  })

  it('returns false if not a holiday', () => {
    const result = isDateHoliday('2018-01-16')
    expect(result).to.be.false
  })

  it('returns false if not holiday on locale', () => {
    const result = isDateHoliday('2018-01-15', 'brazil')
    expect(result).to.be.false
  })

  it('returns true if holiday on locale', () => {
    const result = isDateHoliday('2018-01-15', 'america')
    expect(result).to.be.true
  })
})
