const { By } = require('selenium-webdriver');

class RegisterComponent {

    constructor() {
        this.nameInput = By.id('register-name-input');
        this.emailInput = By.id('register-email-input');
        this.passwordInput = By.id('register-password-input');
        this.c_passwordInput = By.id('register-c_password-input');
        this.createButton = By.id('register-ok-btn');
        this.cancelButton = By.id('register-cancel-btn');
    }
}

module.exports = RegisterComponent;