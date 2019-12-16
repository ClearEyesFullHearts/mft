const { Given, When, Then } = require('cucumber');
const assert = require('assert');
const Navigate = require('../actions/navigate');
const Inputs = require('../actions/inputs');

Given(/^I browse to (.*) page$/, async function(pageName) {
    this.context.currentpage = await Navigate.toPage(pageName);
    // await this.context.currentpage.amThere();
});

Given(/^I fill (.*) input as "([^"]*)"$/, async function (inputName, text) {
    await Inputs.writes(this.context.currentpage[inputName], text);
});

Then(/^I am on (.*) page$/, async function (pageName) {
    assert.equal(this.context.currentpage.name, pageName);
    await this.context.currentpage.amThere();
});

When(/^I click on (.*)$/, async function (inputName) {
    await Inputs.click(this.context.currentpage[inputName]);
});