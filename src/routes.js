const { getLogger } = require('./lib/logging/logger')
const restProcessor = require('./lib/processors/restProcessor')

exports.setupRoute = (app) => {
  const log = getLogger()
  const BASE_PATH = process.env.API_BASE_PATH
  log.info('routes: setting base path', { basePath: BASE_PATH })

  app.get(`${BASE_PATH}/getBusinessDateWithDelay/:initialDate/:delay`, restProcessor.processSettlementDate)
  app.get(`${BASE_PATH}/getBusinessDateWithDelay/:initialDate/:delay/:locale`, restProcessor.processSettlementDate)
  app.post(`${BASE_PATH}/getBusinessDateWithDelay`, restProcessor.processSettlementDate)

  app.get(`${BASE_PATH}/isDateBusinessDay/:date/:locale`, restProcessor.processIsDateBusinessDay)
  app.post(`${BASE_PATH}/isDateBusinessDay`, restProcessor.processIsDateBusinessDay)
}
