/* eslint-disable no-unused-vars */
const logger = require('debug');
const ErrorHelper = require('../../server/error.js');
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
      next(err);
    });
};
module.exports.loginUser = (req, res, next) => {
  debug('loginUser body', req.swagger.params.body.value);
  UserLogin.getAuth(req.app.locals.db, req.swagger.params.body.value)
    .then((auth) => {
      res.json(auth);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.resetUserPassword = (req, res) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};

module.exports.getAllUsers = (req, res) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};

module.exports.getUser = (req, res) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.updateUser = (req, res) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.removeUser = (req, res) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
