const config = require('config');
const assert = require('assert');
const { driver } = require('../support/web_driver');
const { getByName } = require('../pages');

class Navigate {
    static async toPage(pageName) {
        const page = getByName(pageName);
        await driver.get(page.url);
        return page;
    }
    static async waitPlease(ms){
        await driver.sleep(ms);
    }
}

module.exports = Navigate;