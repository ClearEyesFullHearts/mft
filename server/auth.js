
const config = require('config');
const jwt = require('jsonwebtoken');
const logger = require('debug');
const ErrorHelper = require('./error.js');

const debug = logger('mft-back:server:auth');
const debugSecret = logger('secret:mft-back:auth');

class AuthMiddleware {
  static verify(secret) {
    const ROLE_GUARD = config.get('base.security');

    return function verifyMiddleware(req, res, next) {
      if (!req.swagger || !req.swagger.operation || !req.swagger.operation[ROLE_GUARD]) {
        debug('Route is open');
        return next();
      }
      debug('Route is guarded');
      if (req.headers.authorization) {
        const heads = req.headers.authorization.split(' ');
        if (heads.length < 2) return next(ErrorHelper.getCustomError(401, ErrorHelper.CODE.MIS_AUTH_HEADER, 'Misformed authorization header'));

        const token = heads[1];
        debug('verify token', token);
        debugSecret('verify secret', secret);
        jwt.verify(token, secret, (err, payload) => {
          if (err) {
            debug('verify error', err);
            return next(ErrorHelper.getCustomError(403, ErrorHelper.CODE.BAD_TOKEN, err.message));
          }
          debug('verify ok', payload);
          const roles = req.swagger.operation[ROLE_GUARD];
          for (let i = 0; i < roles.length; i += 1) {
            if (payload.roles.indexOf(roles[i]) !== -1) {
              debug('role is accepted');
              req.auth = payload;
              return next();
            }
          }
          debug('User role is not authorized for this route');
          return next(ErrorHelper.getCustomError(403, ErrorHelper.CODE.BAD_ROLE, 'User role is not authorized for this route'));
        });

        return undefined;
      }
      return next(ErrorHelper.getCustomError(401, ErrorHelper.CODE.NO_AUTH_HEADER, 'Missing authorization header'));
    };
  }
}


module.exports = AuthMiddleware;
