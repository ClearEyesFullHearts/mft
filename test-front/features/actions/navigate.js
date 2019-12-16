const config = require('config');
const assert = require('assert');
const { driver } = require('../support/web_driver');
const LoginPage = require('../pages/login/loginPage');

class Navigate {
    static async toPage(pageName) {
        let page;
        switch(pageName){
            case 'login':
                page = new LoginPage();
                break;
            default:
                throw new Error('Unknown page:' + pageName);
        }
        await driver.get(page.url);
        return page;
    }
}

module.exports = Navigate;