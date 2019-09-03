const bunyan = require('bunyan')

let loggerIntance

exports.getLogger = (options = {}) => {
  if (!loggerIntance) {
    loggerIntance = bunyan.createLogger({
      name: process.env.APP_NAME || 'default app name',
      level: process.env.LOG_LEVEL || 'debug',
      ...options,
    })
  }

  return loggerIntance
}
