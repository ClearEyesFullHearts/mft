const { Given, When, Then } = require('cucumber');
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const config = require('config');
const Navigate = require('../actions/navigate');
const Inputs = require('../actions/inputs');
const Observe = require('../actions/observe');

Given(/^I browse to (.*) page$/, async function(pageName) {
    this.context.currentpage = await Navigate.toPage(pageName);
});

Given(/^I am a new connected user$/, async function () {
    this.context.currentemail = `${uuidv4()}@mathieufont.com`;
    this.context.currentpassword = 'testtesttest';
    const body = {
        username: 'testUser',
        email: this.context.currentuser,
        password: this.context.currentpassword
    };
    await this.got.post(config.get('base.server.url') + '/users', {
        json: true, // this is required
        body
    });
    await Navigate.toPage('login');
    await Inputs.writes(this.context.currentpage.email, this.context.currentuser);
    await Inputs.writes(this.context.currentpage.password, this.context.currentpassword);
    await Inputs.click(this.context.currentpage.connect);
});

When(/^I fill (.*) input as "([^"]*)"$/, async function (inputName, text) {
    text = this.context.replaceVariables(text);
    await Inputs.writes(this.context.currentpage[inputName], text);
});

Then(/^I am on (.*) page$/, async function (pageName) {
    // assert.equal(this.context.currentpage.name, pageName);
    await this.context.currentpage.amThere();
});

When(/^I click on (.*)$/, async function (inputName) {
    await Inputs.click(this.context.currentpage[inputName]);
});

Then(/^I see (.*) is disabled$/, async function (inputName) {
    const isEnabled = await Observe.iSeeIsEnabled(this.context.currentpage[inputName]);
    assert.equal(!isEnabled);
});

Then(/^an e-mail was sent to "([^"]*)"$/, async function (to) {
    const response = await this.got.get(config.get('base.mail.serverURL') + '/api/emails?to=' + to, {
        json: true
    });
    assert.equal(response.body.length, 1, 'There should be one and only one email to this user');
});

Then(/^I see "([^"]*)" as an error message$/, async function (msg) {
    const txt = await Observe.iSeeText(this.context.currentpage.error);
    assert.equal(txt, msg);
});

Then(/^No emails has been sent to "([^"]*)"$/, async function (to) {
    const response = await this.got.get(config.get('base.mail.serverURL') + '/api/emails?to=' + to, {
        json: true
    });
    assert.equal(response.body.length, 0);
});