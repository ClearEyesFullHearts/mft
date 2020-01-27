const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');
const moment = require('moment');

class InvoiceData {
  constructor() {
    this.invoiceSchema = new mongoose.Schema({
      id: {
        type: Number,
        unique: true,
      },
      user: {
        type: Number,
        required: true,
      },
      companyAddress: {
        type: String,
        required: true,
      },
      clientAddress: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      toPay: {
        type: Number,
        required: true,
      },
      vat: {
        0: Number,
        5.5: Number,
        10: Number,
        20: Number,
      },
      clientRef: String,
      paymentDueDate: String,
      idPrefix: String,
      status: {
        creation: {
          type: Date,
          required: true,
        },
        collected: {
          type: Date,
          validate: {
            validator(c) {
              return this.creation && moment(this.creation).isSameOrBefore(c, 'day');
            },
          },
        },
        vatPaid: {
          type: Date,
          validate: {
            validator(vp) {
              return this.collected && moment(this.collected).isSameOrBefore(vp, 'day');
            },
          },
        },
        socPaid: {
          type: Date,
          validate: {
            validator(sp) {
              return this.vatPaid && moment(this.vatPaid).isSameOrBefore(sp, 'day');
            },
          },
        },
      },
      products: [
        {
          title: {
            type: String,
            required: true,
          },
          description: String,
          number: {
            type: Number,
            required: true,
          },
          unitPrice: {
            type: Number,
            required: true,
          },
          totalPrice: Number,
          vatPercent: {
            type: String,
            enum: ['0', '5.5', '10', '20'],
            required: true,
          },
          vatTotal: Number,
        },
      ],
    });
  }

  async init(conn) {
    this.invoiceSchema.plugin(autoIncrement, { model: 'Invoice', field: 'id' });
    this.Doc = conn.model('Invoice', this.invoiceSchema);
    await this.Doc.init();
  }
}

module.exports = InvoiceData;
