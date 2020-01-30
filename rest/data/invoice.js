const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');

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
      ref: Number,
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
      vat: { // match product's vatPercent enum
        rate_5_5: Number,
        rate_10: Number,
        rate_20: Number,
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
        },
        vatPaid: {
          type: Date,
        },
        socPaid: {
          type: Date,
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
