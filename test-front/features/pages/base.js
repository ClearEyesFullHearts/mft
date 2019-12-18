
const assert = require('assert');
const { driver } = require('../support/web_driver');
const { By } = require('selenium-webdriver');

class BasePage {

    constructor(title, url) {
        this.title = title;
        this.url = url;
        this.globalError = By.id('global-err-msg');
    }
    
    get error() {
        return this.globalError;
    }

    async amThere(){
        const title = await driver.getTitle();
        assert.equal(title, this.title);
        const url = await driver.getCurrentUrl();
        assert.equal(url, this.url);
    }
}

module.exports = BasePage;