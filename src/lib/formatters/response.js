exports.formatResponse = (reqParam, results = {}, errorMsg = '') => {
  const error = {}
  if (errorMsg) {
    error.message = errorMsg
  }

  return {
    ok: !errorMsg,
    initialQuery: {
      ...reqParam,
    },
    ...(!errorMsg && { results }),
    ...(errorMsg && { error }),
  }
}
