/* eslint-disable no-unused-vars */
const logger = require('debug');
const ErrorHelper = require('../../server/error.js');
const Invoicing = require('./implem/invoicing.js');

const debug = logger('mft-back:invoice:connection');

module.exports.getAllInvoices = (req, res, next) => {
  debug('getAllInvoices');
  Invoicing.getAll(req.app.locals.db, req.auth)
    .then((allInvoices) => {
      res.json(allInvoices);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.createInvoice = (req, res, next) => {
  debug('createInvoice');
  const ID = req.swagger.params.userid.value;
  const body = req.swagger.params.body.value;
  Invoicing.createNewInvoice(req.app.locals.db, req.auth, ID, body)
    .then((invoice) => {
      res.statusCode = 201;
      res.json(invoice);
    })
    .catch((err) => {
      next(err);
    });
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
