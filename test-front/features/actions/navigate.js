const config = require('config');
const assert = require('assert');
const { driver } = require('../support/web_driver');
const LoginPage = require('../pages/login/loginPage');
const LandingPage = require('../pages/landing/landingPage');
const InfoPage = require('../pages/infos/infoPage');

class Navigate {
    static async toPage(pageName) {
        let page;
        switch (pageName) {
            case 'login':
                page = new LoginPage();
                break;
            case 'landing':
                page = new LandingPage();
                break;
            case 'information':
                page = new InfoPage();
                break;
            default:
                throw new Error('Unknown page:' + pageName);
        }
        await driver.get(page.url);
        return page;
    }
}

module.exports = Navigate;