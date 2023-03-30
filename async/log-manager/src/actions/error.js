const logger = require('debug');
const debug = logger('log-manager:async:action:error');

module.exports = (req, res, next) => {
    const { path } = req;
    debug(`logging for ${path}`);
    res.end();
};
