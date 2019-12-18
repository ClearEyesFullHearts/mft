const config = require('config');
const BasePage = require('../base');
const LoginComp = require('./login');
const RegisterComp = require('./register');
const ResetComp = require('./reset');

class LoginPage extends BasePage {
    constructor() {
        super(config.get('public.name'), config.get('public.url'));
        this.name = 'Login';
        this.loginComponent = new LoginComp();
        this.registerComponent = new RegisterComp();
        this.resetComponent = new ResetComp();
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
        return this.registerComponent.emailInput;
    }
    get confirmPassword() {
        return this.registerComponent.emailInput;
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
        return this.registerComponent.newButton;
    }
    get send() {
        return this.resetComponent.sendButton;
    }
}

module.exports = LoginPage;