const logger = require('debug');
const debug = logger('log-manager:async:action:logging');

module.exports = (req, res, next) => {
  const { path, api: { params } } = req;
  debug(`logging for ${path}`);
  if(params.severity && params.severity === 'info'){
    res.end();
  }else{
    next();
  }
}
