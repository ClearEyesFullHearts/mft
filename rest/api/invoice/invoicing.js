/* eslint-disable no-unused-vars */
const ErrorHelper = require('../../server/error.js');

module.exports.getAllInvoices = (req, res, next) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.createInvoice = (req, res, next) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.getInvoice = (req, res, next) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.changeInvoice = (req, res, next) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.removeInvoice = (req, res, next) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
module.exports.updateInvoiceStatus = (req, res, next) => {
  throw ErrorHelper.getCustomError(501, ErrorHelper.CODE.NOT_IMPLEMENTED, 'Not Implemented');
};
