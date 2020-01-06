const config = require('config');
const assert = require('assert');
const { driver } = require('../../support/web_driver');
const BasePage = require('../base');
const LoginComp = require('./login');
const RegisterComp = require('./register');
const ResetComp = require('./reset');

class LoginPage extends BasePage {
    constructor() {
        super(config.get('public.name'), `${config.get('public.url')}/`);
        this.name = 'login';
        this.loginComponent = new LoginComp();
        this.registerComponent = new RegisterComp();
        this.resetComponent = new ResetComp();
    }

    async amThere() {
        const title = await driver.getTitle();
        assert.equal(title, this.title);
        const url = await driver.getCurrentUrl();
        assert.equal(url, this.url);
    }

    get email(){
        return this.loginComponent.emailInput;
    }
    get password(){
        return this.loginComponent.passwordInput;
    }
    get username() {
        return this.registerComponent.nameInput;
    }
    get newEmail() {
        return this.registerComponent.emailInput;
    }
    get newPassword() {
        return this.registerComponent.passwordInput;
    }
    get confirmPassword() {
        return this.registerComponent.c_passwordInput;
    }
    get knownEmail() {
        return this.resetComponent.emailInput;
    }

    get connect() {
        return this.loginComponent.logButton;
    }
    get signUp() {
        return this.loginComponent.newButton;
    }
    get forgot() {
        return this.loginComponent.forgotButton;
    }
    get create() {
        return this.registerComponent.createButton;
    }
    get send() {
        return this.resetComponent.sendButton;
    }
}

module.exports = LoginPage;