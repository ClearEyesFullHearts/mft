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
        const txt = await driver.findElement(input);
        const visible = await txt.isDisplayed();
        assert(visible);
        return await txt.getText();
    }
    static async iSeeErrorMsg(input, msg) {
        await driver.wait(until.elementLocated(input), 1000);
        const errMsg = await driver.findElement(input);
        const txt = await errMsg.getText();
        assert.equal(txt, msg);
    }
    static async isVisible(input) {
        await driver.wait(until.elementLocated(input), 1000);
        const elmt = await driver.findElement(input);
        const visible = await elmt.isDisplayed();
        assert(visible);
    }
    static async isNotVisible(input) {
        const elmts = await driver.findElements(input);
        if(elmts.length > 0){
            const visible = await elmts[0].isDisplayed();
            assert.equal(visible, false);
        }else{
            return true;
        }
    }
}

module.exports = Observe;