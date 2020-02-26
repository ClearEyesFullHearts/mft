const { By } = require('selenium-webdriver');

class NewProductComponent {

    constructor() {
        this.titleInput = By.id('prod-title-input');
        this.descInput = By.id('prod-desc-input');
        this.numberInput = By.id('prod-num-input');
        this.unitInput = By.id('prod-unit-input');
        this.vatInput = By.id('prod-vat-input');
        this.addButton = By.id('prod-add-btn');
    }
}

module.exports = NewProductComponent;