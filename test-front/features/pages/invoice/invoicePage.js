const config = require('config');
const BasePage = require('../base');
const InvoicesListComp = require('./invoicesList');
const NewInvoiceComp = require('./newInvoice');
const CreatedInvoiceComp = require('./createdInvoice');
const InvoiceComp = require('./invoice');

class InvoicePage extends BasePage {
    constructor() {
        super('Invoicing', `${config.get('public.url')}/invoice`);
        this.name = 'invoices';
        this.invoicesList = new InvoicesListComp();
        this.newInvoice = new NewInvoiceComp();
        this.createdInvoice = new CreatedInvoiceComp();
        this.invoice = new InvoiceComp();
    }

}