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
module.exports.getMyInvoices = (req, res, next) => {
  debug('getMyInvoices');
  const ID = req.swagger.params.userid.value;
  Invoicing.getMyOwn(req.app.locals.db, req.auth, ID)
    .then((allInvoices) => {
      res.json(allInvoices);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.getInvoice = (req, res, next) => {
  debug('getInvoice');
  const userID = req.swagger.params.userid.value;
  const ID = req.swagger.params.id.value;
  Invoicing.getOne(req.app.locals.db, req.auth, userID, ID)
    .then((invc) => {
      res.json(invc);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.changeInvoice = (req, res, next) => {
  debug('changeInvoice');
  const userID = req.swagger.params.userid.value;
  const ID = req.swagger.params.id.value;
  const data = req.swagger.params.body.value;
  Invoicing.modifyCreatedInvoice(req.app.locals.db, req.auth, userID, ID, data)
    .then((invc) => {
      res.json(invc);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.removeInvoice = (req, res, next) => {
  debug('removeInvoice');
  const userID = req.swagger.params.userid.value;
  const ID = req.swagger.params.id.value;
  Invoicing.removeOne(req.app.locals.db, req.auth, userID, ID)
    .then(() => {
      res.json();
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.updateInvoiceStatus = (req, res, next) => {
  debug('updateInvoiceStatus');
  const userID = req.swagger.params.userid.value;
  const ID = req.swagger.params.id.value;
  const status = req.swagger.params.status.value;
  const data = req.swagger.params.body.value;
  Invoicing.setStatusDate(req.app.locals.db, req.auth, userID, ID, status, data)
    .then((invc) => {
      res.json(invc);
    })
    .catch((err) => {
      next(err);
    });
};
