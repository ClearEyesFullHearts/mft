
const logger = require('debug');
const moment = require('moment');
const ErrorHelper = require('../../../server/error.js');

const debug = logger('mft-back:invoice:implem');

class Invoicing {
  static async getAll(db, auth) {
    debug('get all invoices');
    if (auth.roles.indexOf('ROLE_ADMIN') >= 0) {
      const invoices = await db.invoices.Doc.find({}).sort('user');
      return invoices.map(Invoicing.toTransportInvoice);
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.BAD_ROLE, 'User role is not authorized for this route');
  }

  static async getMyOwn(db, auth, userID) {
    debug('get my invoices');
    const itsMe = auth.user.id === userID;
    if (itsMe) {
      const invoices = await db.invoices.Doc.find({ user: userID }).sort('status.creation');
      return invoices.map(Invoicing.toTransportInvoice);
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static async getOne(db, auth, userID, invoiceID) {
    debug('get invoice', invoiceID);
    const itsMe = auth.user.id === userID;
    if (itsMe) {
      const invoice = await db.invoices.Doc.findOne({ user: userID, id: invoiceID });
      if (invoice) {
        return Invoicing.toTransportInvoice(invoice);
      }
      throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'Invoice not found');
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
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
      newInvoice.products = calculation.products;
      newInvoice.price = calculation.price;
      newInvoice.toPay = calculation.toPay;
      newInvoice.vat = calculation.vat;

      newInvoice.status.creation = Date.now();

      newInvoice = await newInvoice.save();
      debug('createNewInvoice newInvoice', newInvoice);

      return Invoicing.toTransportInvoice(newInvoice);
    }

    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static async modifyCreatedInvoice(db, auth, userID, invoiceID, data) {
    debug('modify invoice', invoiceID);
    const itsMe = auth.user.id === userID;
    if (itsMe) {
      const invoice = await db.invoices.Doc.findOne({ user: userID, id: invoiceID });

      if (!invoice) {
        throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'Invoice not found');
      }
      if (invoice.status.collected) {
        throw ErrorHelper.getCustomError(400, ErrorHelper.CODE.INVOICE_IS_SET, 'Invoice cannot be updated');
      }

      // set invoice with new values
      ['companyAddress', 'clientAddress', 'price', 'toPay', 'vat',
        'clientRef', 'paymentDueDate', 'idPrefix'].forEach((k) => {
        if (data[k] !== undefined) {
          invoice[k] = data[k];
        }
      });

      if (data.products && data.products.length > 0) {
        const prods = [];
        data.products.forEach((p) => {
          const np = {};
          // set products with new values
          ['title', 'description', 'number', 'unitPrice', 'totalPrice', 'vatPercent', 'vatTotal'].forEach((k) => {
            if (p[k] !== undefined) {
              np[k] = p[k];
            }
          });
          prods.push(np);
        });
        // eslint-disable-next-line no-param-reassign
        invoice.products = prods;
      }
      const changedInvoice = await invoice.save();
      return Invoicing.toTransportInvoice(changedInvoice);
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static async removeOne(db, auth, userID, invoiceID) {
    debug('remove invoice', invoiceID);
    const itsMe = auth.user.id === userID;
    if (itsMe) {
      const knownInvoice = await db.invoices.Doc.findOneAndRemove({ user: userID, id: invoiceID });
      if (knownInvoice) {
        return true;
      }
      throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'User not found');
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static async setStatusDate(db, auth, userID, invoiceID, status, { date }) {
    debug('set status', status);
    debug('to date', date);
    const itsMe = auth.user.id === userID;
    if (itsMe) {
      const invoice = await db.invoices.Doc.findOne({ user: userID, id: invoiceID }, { runValidators: true, context: 'query' });

      if (!invoice) {
        throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'Invoice not found');
      }

      let previousDate;
      // eslint-disable-next-line default-case
      switch (status) {
        case 'collected':
          previousDate = invoice.status.creation;
          break;
        case 'vatPaid':
          previousDate = invoice.status.collected;
          break;
        case 'socPaid':
          previousDate = invoice.status.vatPaid;
          break;
      }

      const statusDate = new Date(date);
      if (moment(previousDate).isSameOrBefore(statusDate, 'day')) {
        invoice.status[status] = new Date(date);
      } else {
        throw ErrorHelper.getCustomError(400, ErrorHelper.CODE.STATUS_DATE_INVALID, 'Status date should be following each other');
      }

      const changedInvoice = await invoice.save();
      return Invoicing.toTransportInvoice(changedInvoice);
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static calculateInvoicePrice(prods) {
    let price = 0;
    let toPay = 0;
    const vat = {};
    const setProducts = [];

    prods.forEach((p) => {
      const pSet = Invoicing.productWithPrice(p);
      debug('calculateInvoicePrice pSet:', pSet);

      price += pSet.totalPrice;
      toPay += pSet.totalPrice;

      if (pSet.vatPercent > 0) {
        const vatKey = `rate_${String(pSet.vatPercent).replace('.', '_')}`;

        if (!vat[vatKey]) vat[vatKey] = 0;
        vat[vatKey] += pSet.vatTotal;
        toPay += pSet.vatTotal;
      }

      setProducts.push(pSet);
    });

    return {
      products: setProducts,
      price: Number(price.toFixed(2)),
      toPay: Number(toPay.toFixed(2)),
      vat,
    };
  }

  static productWithPrice(p) {
    const totalPrice = Number((p.number * p.unitPrice).toFixed(2));
    return {
      totalPrice,
      vatTotal: Number(((totalPrice * p.vatPercent) / 100).toFixed(2)),
      ...p,
    };
  }

  static toTransportInvoice({
    id, user, companyAddress, clientAddress, price, toPay, vat,
    clientRef, paymentDueDate, idPrefix, status, products,
  }) {
    return {
      id,
      user,
      companyAddress,
      clientAddress,
      price,
      toPay,
      vat,
      clientRef,
      paymentDueDate,
      idPrefix,
      status,
      products: products ? products.map(Invoicing.toTransportProduct) : undefined,
    };
  }

  static toTransportProduct({
    title, description, number, unitPrice, totalPrice, vatPercent, vatTotal,
  }) {
    return {
      title, description, number, unitPrice, totalPrice, vatPercent, vatTotal,
    };
  }
}

module.exports = Invoicing;
