const config = require('@shared/config');
const logger = require('debug');

const debug = logger('mft-back:server:cors');

class CORSMiddleware {
  static options() {
    const corsHeaders = config.get('public.cors');
    debug('CORS headers defined', corsHeaders);
    return function corsOptionsReq(req, res, next) {
      Object.keys(corsHeaders).forEach((h) => {
        res.header(h, corsHeaders[h]);
      });
      next();
    };
  }
}

module.exports = CORSMiddleware;
