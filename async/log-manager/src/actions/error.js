const logger = require('debug');

const debug = logger('log-manager:async:action:error');

module.exports = (req, res) => {
  const { path } = req;
  debug(`logging for ${path}`);
  res.end();
};
