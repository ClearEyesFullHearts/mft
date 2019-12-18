const { By } = require('selenium-webdriver');

class NavBarComponent {

    constructor() {
        this.logOffButton = By.id('nav-logoff-btn');
    }
}

module.exports = NavBarComponent;