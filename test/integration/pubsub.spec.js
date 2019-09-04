require('dotenv').config()
const { getLogger } = require('../../src/lib/logging/logger')
const { describe, it, before } = require('mocha')
const { expect } = require('chai')
const uuidv4 = require('uuid/v4')
const { startPubSub } = require('../../src/subscriptions')

getLogger({ level: 'error' }) // only log errors

describe('testing subscribing and publishing', () => {
  let channel
  before(() => {
    channel = startPubSub()
  })

  describe('#getBusinessDateWithDelay', () => {
    it('publishes response', (done) => {
      const messageId = uuidv4()
      channel.subscribe('businessDates.getBusinessDateWithDelay.response', (data) => {
        console.log('\npublished response:\n', data, '\n\n')

        expect(data).to.have.all.keys('messageId', 'ok', 'initialQuery', 'results')
        expect(data.messageId).to.equal(messageId)
        expect(data.ok).to.be.true
        done()
      })

      channel.publish('businessDates.getBusinessDateWithDelay.request', {
        messageId,
        initialDate: '2018-01-15T00:00:00Z',
        delay: 3,
        locale: 'america'
      })
    })
  })

  describe('#isDateBusinessDay', () => {
    it('publishes response', (done) => {
      const messageId = uuidv4()
      channel.subscribe('businessDates.isDateBusinessDay.response', (data) => {
        console.log('\npublished response:\n', data, '\n\n')

        expect(data).to.have.all.keys('messageId', 'ok', 'initialQuery', 'results')
        expect(data.messageId).to.equal(messageId)
        expect(data.ok).to.be.true
        done()
      })

      channel.publish('businessDates.isDateBusinessDay.request', {
        messageId,
        date: '2018-01-15',
        locale: 'america'
      })
    })
  })
})
