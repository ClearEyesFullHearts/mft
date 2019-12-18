const assert = require('assert');
const { driver } = require('../support/web_driver');

class Observe {
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