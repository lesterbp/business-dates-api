const postal = require('postal')
const { getLogger } = require('./lib/logging/logger')
const pubSubProcessor = require('./lib/processors/pubSubProcessor')

const setupSubscriptions = (pubSub) => {
  const log = getLogger()
  log.info('subscriptions: setting subscriptions')

  pubSub.subscribe(
    'businessDates.getBusinessDateWithDelay.request',
    (data, envelope) => pubSubProcessor.processSettlementDate(pubSub, data, envelope),
  )

  pubSub.subscribe(
    'businessDates.isDateBusinessDay.request',
    (data, envelope) => pubSubProcessor.processIsDateBusinessDay(pubSub, data, envelope),
  )
}

exports.startPubSub = () => {
  const log = getLogger()
  log.info('subscriptions: setting up channel', { channelName: process.env.PUBSUB_CHANNEL })

  const channel = postal.channel(process.env.PUBSUB_CHANNEL)
  setupSubscriptions(channel)

  return channel
}
