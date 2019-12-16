
const { driver } = require('../support/web_driver');

class Inputs {
    static async writes(input, text) {
        await driver.findElement(input).sendKeys(text);
    }
    static async click(input) {
        await driver.findElement(input).click();
    }
}

module.exports = Inputs;