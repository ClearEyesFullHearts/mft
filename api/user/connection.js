/* eslint-disable no-unused-vars */
const ErrorMiddleware = require('../../server/error.js');

module.exports.createUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
module.exports.loginUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
module.exports.logoutUser = (req, res) => {
  throw ErrorMiddleware.getCustomError(501, 'NOT_IMPLEMENTED', 'Not Implemented');
};
