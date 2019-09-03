const bunyan = require('bunyan')

let loggerIntance

exports.getLogger = (options = {}) => {
  if (!loggerIntance) {
    loggerIntance = bunyan.createLogger({
      name: process.env.APP_NAME,
      level: process.env.LOG_LEVEL,
      ...options,
    })
  }

  return loggerIntance
}
