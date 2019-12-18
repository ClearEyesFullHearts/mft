
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
}

module.exports = Inputs;