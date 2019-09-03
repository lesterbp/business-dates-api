const { describe, it } = require('mocha')
const { expect } = require('chai')
const { settlementDate } = require('../../../../src/lib/dates/calculator')

describe('#settlementDate', () => {
  it('calculates short delays with weekend and holiday', () => {
    const result = settlementDate('2018-11-10T10:10:10Z', 3)
    expect(result).to.be.not.null
    expect(result.businessDate).to.be.equal('2018-11-15T10:10:10Z')
    expect(result.totalDays).to.be.equal(6)
    expect(result.weekendDays).to.be.equal(2)
    expect(result.holidayDays).to.be.equal(1)
  })

  it('calculates short delays with weekend and no holiday', () => {
    const result = settlementDate('2018-11-15T00:00:00Z', 3)
    expect(result).to.be.not.null
    expect(result.businessDate).to.be.equal('2018-11-19T00:00:00Z')
    expect(result.totalDays).to.be.equal(5)
    expect(result.weekendDays).to.be.equal(2)
    expect(result.holidayDays).to.be.equal(0)
  })

  it('calculates long delays with weekend and holiday', () => {
    const result = settlementDate('2018-12-25T00:00:00Z', 20)
    expect(result).to.be.not.null
    expect(result.businessDate).to.be.equal('2019-01-18T00:00:00Z')
    expect(result.totalDays).to.be.equal(30)
    expect(result.weekendDays).to.be.equal(8)
    expect(result.holidayDays).to.be.equal(2)
  })
})
