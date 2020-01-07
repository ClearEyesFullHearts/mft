const assert = require('assert');
const { driver, until } = require('../support/web_driver');

class Inputs {
    static async writes(input, text) {
        await driver.findElement(input).sendKeys(text);
    }
    static async click(input) {
        await driver.findElement(input).click();
    }
    static async focus(input) {
        await driver.findElement(input).sendKeys('');
    }
    static async confirmAlert(){
        await driver.switchTo().alert().accept();
    }
    static async cancelAlert() {
        await driver.switchTo().alert().dismiss();
    }
    static async writesAndUpdate(updatableText, text) {
        await driver.findElement(updatableText.label).click();
        await driver.wait(until.elementIsVisible(driver.findElement(updatableText.text)), 1000);
        await driver.findElement(updatableText.text).clear();
        await driver.findElement(updatableText.text).sendKeys(text);
        await driver.findElement(updatableText.validate).click();
        await driver.wait(until.elementIsVisible(driver.findElement(updatableText.label)), 1000);
        const lblText = await driver.findElement(updatableText.label).getText();
        assert.equal(lblText, text);
    }
    static async writesAndCancel(updatableText, text) {
        const origText = await driver.findElement(updatableText.label).getText();
        await driver.findElement(updatableText.label).click();
        await driver.wait(until.elementIsVisible(driver.findElement(updatableText.text)), 1000);
        await driver.findElement(updatableText.text).clear();
        await driver.findElement(updatableText.text).sendKeys(text);
        await driver.findElement(updatableText.cancel).click();
        await driver.wait(until.elementIsVisible(driver.findElement(updatableText.label)), 1000);
        const lblText = await driver.findElement(updatableText.label).getText();
        assert.equal(lblText, origText);
    }
}

module.exports = Inputs;