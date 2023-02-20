const { By } = require('selenium-webdriver');
const DDPTxtComp = require('../shared/dropdownText');
const NewProduct = require('./product/newProduct');
const ProductList = require('./product/listProduct');

class NewInvoiceComponent {

    constructor() {
        this.companyInput = new UpTxtComp('invc-company');
        this.clientInput = new UpTxtComp('invc-client');
        this.clientRefInput = By.id('invc-clientref-input');
        this.idPrefixInput = By.id('invc-prefix-input');
        this.paymentDueInput = By.id('invc-due-input');
        this.newProduct = new NewProduct();
        this.listProduct = new ProductList();
    }
}

module.exports = NewInvoiceComponent;
