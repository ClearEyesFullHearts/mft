var { Given, When, Then } = require('cucumber');
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const config = require('config');
const Navigate = require('../actions/navigate');
const Inputs = require('../actions/inputs');
const Observe = require('../actions/observe');


Given(/^I am an admin on (.*) page$/, async function (pageName) {
    this.context.currentemail = 'mft-admin-test@mathieufont.com';
    this.context.currentpassword = 'testadmin';
    this.context.currentID = 1;
    this.context.currentusername = '';

    this.context.currentpage = await Navigate.toPage('login');
    await Inputs.writes(this.context.currentpage.email, this.context.currentemail);
    await Inputs.writes(this.context.currentpage.password, this.context.currentpassword);
    await Inputs.click(this.context.currentpage.connect);
    await Observe.waitingForPageChange('information');

    this.context.currentpage = await Navigate.toPage(pageName);
});

Given(/^I am a user on (.*) page$/, async function (pageName) {
    this.context.currentemail = `${uuidv4()}@mathieufont.com`;
    this.context.currentpassword = 'testtesttest';
    this.context.currentusername = uuidv4().toString().substr(0, 8);
    const body = {
        username: this.context.currentusername,
        email: this.context.currentemail,
        password: this.context.currentpassword
    };
    const resp = await this.got.post(config.get('base.server.url') + '/users', {
        json: true, // this is required
        body
    });
    this.context.currentID = resp.body.user.id;
    
    this.context.currentpage = await Navigate.toPage('login');
    await Inputs.writes(this.context.currentpage.email, this.context.currentemail);
    await Inputs.writes(this.context.currentpage.password, this.context.currentpassword);
    await Inputs.click(this.context.currentpage.connect);
    await Observe.waitingForPageChange('landing');

    this.context.currentpage = await Navigate.toPage(pageName);
});

Given(/^I do not see (.*) input$/, async function (inputName) {
    await Observe.isNotVisible(this.context.currentpage[inputName]);
});

When(/^I see (.*) text is "([^"]*)"$/, async function (inputName, text) {
    text = this.context.replaceVariables(text);
    const label = await Observe.iSeeText(this.context.currentpage[inputName]);
    assert.equal(label, text);
});

When(/^I update (.*) with "([^"]*)"$/, async function (inputName, text) {
    text = this.context.replaceVariables(text);
    const label = await Inputs.writesAndUpdate(this.context.currentpage[inputName], text)
});

When(/^I see (.*) input$/, async function (inputName) {
    await Observe.isVisible(this.context.currentpage[inputName]);
});

Then(/^I see user for ID "([^"]*)"$/, async function (userID) {
    userID = this.context.replaceVariables(userID);
    await Observe.isVisible(this.context.currentpage.user(userID));
});

When(/^I delete user "([^"]*)"$/, async function (userID) {
    userID = this.context.replaceVariables(userID);
    await Inputs.click(this.context.currentpage.deleteUser(userID));
});

Then(/^There is no delete button for me$/, async function () {
    await Observe.isNotVisible(this.context.currentpage.deleteUser(this.context.currentID));
});

When(/^I confirm my choice$/, async function () {
    await Inputs.confirmAlert();
});
When(/^I cancel my choice$/, async function () {
    await Inputs.confirmAlert();
});