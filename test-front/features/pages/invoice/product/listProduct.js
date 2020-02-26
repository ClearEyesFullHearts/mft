const { By } = require('selenium-webdriver');

class ProductListComponent {

    productLine(id) {
        return By.id(`prod__row_${id}`);
    }
    titleLabel(id) {
        return By.id(`prod-titlelbl-${id}`);
    }
    descLabel(id) {
        return By.id(`prod-desclbl-${id}`);
    }
    numberLabel(id) {
        return By.id(`prod-numlbl-${id}`);
    }
    unitLabel(id) {
        return By.id(`prod-unitlbl-${id}`);
    }
    vatPercentLabel(id) {
        return By.id(`prod-vatlbl-${id}`);
    }
    priceLabel(id) {
        return By.id(`prod-pricelbl-${id}`);
    }
    totalLabel(id) {
        return By.id(`prod-totallbl-${id}`);
    }
    deleteButton(id) {
        return By.id(`prod-delete-${id}`);
    }

}

module.exports = ProductListComponent;