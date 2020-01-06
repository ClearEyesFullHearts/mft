const assert = require('assert');
const { driver } = require('../support/web_driver');

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
    static async writesAndUpdate(updatableText, text) {
        await driver.findElement(updatableText.label).click();
        await driver.wait(until.elementIsVisible(updatableText.text), 1000);
        await driver.findElement(updatableText.text).sendKeys(text);
        await driver.findElement(updatableText.validate).click();
        await driver.wait(until.elementIsVisible(updatableText.label), 1000);
        const lblText = await driver.findElement(updatableText.label).getText();
        assert.equal(lblText, text);
    }
    static async writesAndCancel(updatableText, text) {
        const origText = await driver.findElement(updatableText.label).getText();
        await driver.findElement(updatableText.label).click();
        await driver.wait(until.elementIsVisible(updatableText.text), 1000);
        await driver.findElement(updatableText.text).sendKeys(text);
        await driver.findElement(updatableText.cancel).click();
        await driver.wait(until.elementIsVisible(updatableText.label), 1000);
        const lblText = await driver.findElement(updatableText.label).getText();
        assert.equal(lblText, origText);
    }
}

module.exports = Inputs;