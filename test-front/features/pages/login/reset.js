const { By } = require('selenium-webdriver');

class ResetComponent {

    constructor() {
        this.emailInput = By.id('forgot-email-input');
        this.sendButton = By.id('forgot-send-btn');
    }
}

module.exports = ResetComponent;