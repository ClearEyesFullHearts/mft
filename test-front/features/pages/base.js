
const assert = require('assert');
const { driver } = require('../support/web_driver');

class BasePage {

    constructor(title, url) {
        this.title = title;
        this.url = url;
    }

    async amThere(){
        const title = await driver.getTitle();
        assert.equal(title, this.title);
        const url = await driver.getCurrentUrl();
        assert.equal(url, this.url);
    }
}

module.exports = BasePage;