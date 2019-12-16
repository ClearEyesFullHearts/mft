const config = require('config');
const BasePage = require('../base');
const LoginComp = require('./login');

class LoginPage extends BasePage {
    constructor() {
        super(config.get('public.name'), config.get('public.url'));
        this.name = 'Login';
        this.loginComponent = new LoginComp();
    }

    get email(){
        return this.loginComponent.emailInput;
    }
}

module.exports = LoginPage;