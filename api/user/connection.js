/* eslint-disable no-unused-vars */
const logger = require('debug');
const ErrorMiddleware = require('../../server/error.js');
const UserLogin = require('./implem/login.js');

const debug = logger('mft-back:user:connection');

module.exports.createUser = (req, res, next) => {
  debug('createUser body', req.swagger.params.body.value);
  UserLogin.createNewUser(req.app.locals.db, req.swagger.params.body.value)
    .then((auth) => {
      res.statusCode = 201;
      res.json(auth);
    })
    .catch((err) => {
      next(ErrorMiddleware.getCustomError(500, 'SERVER_ERROR', err.message));
    });
};
module.exports.loginUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
module.exports.resetUserPassword = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};

module.exports.getAllUsers = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};

module.exports.getUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
module.exports.updateUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
module.exports.removeUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
