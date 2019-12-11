/* eslint-disable no-unused-vars */
const ErrorMiddleware = require('../../server/error.js');

module.exports.createUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
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
