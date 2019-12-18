const { By } = require('selenium-webdriver');

class LoginComponent {

    constructor() {
        this.emailInput = By.id('login-email-input');
        this.passwordInput = By.id('login-password-input');
        this.logButton = By.id('login-log-btn');
        this.newButton = By.id('login-new-btn');
        this.forgotButton = By.id('login-forgot-btn');
    }
}

module.exports = LoginComponent;