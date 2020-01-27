
// const config = require('config');
const logger = require('debug');
const ErrorHelper = require('../../../server/error.js');

const debug = logger('mft-back:invoice:implem');

class Invoicing {
  static async getAll(db, auth) {
    debug('get all invoices');
    if (auth.roles.indexOf('ROLE_ADMIN') >= 0) {
      const invoices = await db.invoices.Doc.find({}).sort('user');
      return invoices;
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.BAD_ROLE, 'User role is not authorized for this route');
  }

  static async createNewInvoice(db, auth, userID, {
    companyAddress,
    clientAddress,
    products,
    clientRef,
    paymentDueDate,
    idPrefix,
  }) {
    const itsMe = auth.user.id === userID;
    if (itsMe) {
      debug('create new invoice for user', userID);
      let newInvoice = new db.invoices.Doc();
      newInvoice.user = userID;
      newInvoice.companyAddress = companyAddress;
      newInvoice.clientAddress = clientAddress;

      if (clientRef) newInvoice.clientRef = clientRef;
      if (paymentDueDate) newInvoice.paymentDueDate = paymentDueDate;
      if (idPrefix) newInvoice.idPrefix = idPrefix;

      const calculation = Invoicing.calculateInvoicePrice(products);
      newInvoice.products = products;
      newInvoice.price = calculation.price;
      newInvoice.toPay = calculation.toPay;
      newInvoice.vat = calculation.vat;

      newInvoice.status.creation = new Date();

      newInvoice = await newInvoice.save();
      debug('createNewInvoice newInvoice', newInvoice);

      return newInvoice;
    }

    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static calculateInvoicePrice(prods) {
    let price = 0;
    let toPay = 0;
    const vat = {};

    prods.forEach((p) => {
      Invoicing.setProductPrice(p);

      price += p.totalPrice;
      toPay += p.totalPrice;

      if (!vat[String(p.vatPercent)]) vat[String(p.vatPercent)] = 0;
      vat[String(p.vatPercent)] += p.vatTotal;
      toPay += p.vatTotal;
    });

    return {
      price,
      toPay,
      vat,
    };
  }

  static setProductPrice(p) {
    // eslint-disable-next-line no-param-reassign
    p.totalPrice = Number((p.number * p.unitPrice).toFixed(2));
    // eslint-disable-next-line no-param-reassign
    p.vatTotal = Number(((p.totalPrice * p.vatPercent) / 100).toFixed(2));
  }
}

module.exports = Invoicing;
