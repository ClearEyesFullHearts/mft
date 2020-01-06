
const assert = require('assert');
const { driver } = require('../support/web_driver');
const { By } = require('selenium-webdriver');
const NavbarComp = require('./shared/navbar');

class BasePage {

    constructor(title, url) {
        this.title = title;
        this.url = url;
        this.globalError = By.id('global-err-msg');
        this.pageTitle = By.id('global-title');
        this.navbar = new NavbarComp();
    }
    
    get error() {
        return this.globalError;
    }

    get logOut() {
        return this.navbar.logOffButton;
    }
    get profileNav() {
        return this.navbar.profileButton;
    }

    async amThere(){
        const elmt = await driver.findElement(this.pageTitle);
        const visible = await elmt.isDisplayed();
        assert(visible);
        const title = await elmt.getText();
        assert.equal(title, this.title);
        const url = await driver.getCurrentUrl();
        assert.equal(url, this.url);
    }
}

module.exports = BasePage;