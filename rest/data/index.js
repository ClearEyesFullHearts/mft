const mongoose = require('mongoose');
const config = require('config');
const logger = require('debug');
const UserData = require('./user.js');
const InvoiceData = require('./invoice.js');

const debug = logger('mft-back:data');

class Data {
  constructor() {
    this.users = new UserData();
    this.invoices = new InvoiceData();
  }

  async init() {
    try {
      debug('initialize mongodb connection');
      this.connection = await mongoose.connect(config.get('secret.mongo.url'), {
        autoIndex: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      debug('initialization connection error', err);
      throw err;
    }

    debug('initialize users collection');
    await this.users.init(this.connection);
    debug('initialize invoices collection');
    await this.invoices.init(this.connection);

    debug('finished initialization');
  }
}

module.exports = Data;
