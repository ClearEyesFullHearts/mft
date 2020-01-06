const { By } = require('selenium-webdriver');
const UpTxtComp = require('../shared/updatableText');

class UserComponent {

    constructor() {
        this.usernameInput = new UpTxtComp('user-name');
        this.emailInput = By.id('user-email-input');
        this.updatePasswordButton = By.id('user-update-btn');
        this.passwordInput = By.id('user-password-input');
        this.c_passwordInput = By.id('user-c_password-input');
        this.deleteButton = By.id('user-delete-btn');
    }
}

module.exports = UserComponent;