const { getLogger } = require('./lib/logging/logger')

exports.setupRoute = (app) => {
  const log = getLogger()
  const BASE_PATH = process.env.API_BASE_PATH
  log.info('routes: setting base path', { basePath: BASE_PATH })

  app.get(`${BASE_PATH}/settlement`, (req, res) => {
    res.json({ sucess: true })
  })
}
