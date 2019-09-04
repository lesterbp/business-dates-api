const { describe, it } = require('mocha')
const { expect } = require('chai')
const { getLogger } = require('../../../../src/lib/logging/logger')
const { numberOfHolidays, isDateHoliday, isDateBusinessDay } = require('../../../../src/lib/dates/holiday')

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

  it('throws if invalid start date', () => {
    const fn = () => numberOfHolidays('2018-01-01aaa', '2018-02-19')
    expect(fn).to.throw()
  })

  it('throws if invalid end date', () => {
    const fn = () => numberOfHolidays('2018-01-01', '2018-02-19aaa')
    expect(fn).to.throw()
  })
})

describe('#isDateHoliday', () => {
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

  it('throws if invalid date', () => {
    const fn = () => isDateHoliday('2018-01-15aaa', 'america')
    expect(fn).to.throw()
  })
})

describe('#isDateBusinessDay', () => {
  it('returns false if holiday', () => {
    const result = isDateBusinessDay('2018-01-15')
    expect(result).to.be.false
  })

  it('returns true if not a holiday and weekday', () => {
    const result = isDateBusinessDay('2018-01-16')
    expect(result).to.be.true
  })

  it('returns false if weekend', () => {
    const result = isDateBusinessDay('2018-01-14')
    expect(result).to.be.false
  })

  it('throws if invalid date', () => {
    const fn = () => isDateBusinessDay('2018-01-15aaa')
    expect(fn).to.throw()
  })
})
