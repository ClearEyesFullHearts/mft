const assert = require('assert');
const { driver, until } = require('../support/web_driver');
const { getByName } = require('../pages');

class Observe {
    static async waitingForPageChange(pageName) {
        const page = getByName(pageName);
        await driver.wait(until.urlContains(page.url), 3000);
        return page;
    }
    static async iSeeIsEnabled(input) {
        const elmt = await driver.findElement(input);
        const visible = await elmt.isDisplayed();
        assert(visible);
        return await elmt.isEnabled();
    }
    static async iSeeText(input) {
        const errMsg = await driver.findElement(input);
        const visible = await errMsg.isDisplayed();
        assert(visible);
        return await errMsg.getText();
    }
}

module.exports = Observe;