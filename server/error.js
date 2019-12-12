
const logger = require('debug');

const debug = logger('mft-back:server:error');

class ErrorHelper {
  static get CODE() {
    return {
      NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
      SERVER_ERROR: 'SERVER_ERROR',
      KNOWN_EMAIL: 'KNOWN_EMAIL',
      BAD_ROLE: 'BAD_ROLE',
      MIS_AUTH_HEADER: 'MIS_AUTH_HEADER',
      BAD_TOKEN: 'BAD_TOKEN',
      NO_AUTH_HEADER: 'NO_AUTH_HEADER',
    };
  }

  static catchMiddleware() {
    return function catchMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
      debug('error received', err);
      let error;
      if (typeof err !== 'object') {
      // If the object is not an Error, create a representation that appears to be
        error = {
          status: 500,
          failedValidation: false,
          message: String(err), // Coerce to string
          code: 'SERVER_ERROR',
        };
      } else {
        // Ensure that err.message is enumerable (It is not by default)
        Object.defineProperty(err, 'message', { enumerable: true });
        error = err;
      }
      if (res.statusCode >= 400) {
        error.status = res.statusCode;
      }

      res.statusCode = error.status;
      res.json(error);
    };
  }

  static getCustomError(status, code, message) {
    const err = new Error(message);
    err.status = status;
    err.failedValidation = false;
    err.code = code;

    return err;
  }
}


module.exports = ErrorHelper;
