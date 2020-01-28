const { Given, When, Then } = require('cucumber');
const config = require('config');
const Util = require('../support/util');

Given("I am a new user", async function () {
    const body = Util.createRandomUser();
    let response;
    try{
        response = await this.got.post(this.apickli.domain + '/users', {
            json: true, // this is required
            body
        });
    }catch(err){
        console.log(err)
        throw new Error('Server Error');
    }

    if (response.body.auth && response.body.token && response.body.user.id) {
        this.apickli.storeValueInScenarioScope('newUserID', response.body.user.id);
        this.apickli.storeValueInScenarioScope('newUserName', response.body.user.username);
        this.apickli.storeValueInScenarioScope('newUserEmail', response.body.user.email);
        this.apickli.setAccessToken(response.body.token);
        this.apickli.setBearerToken();
    } else {
        throw new Error('User not created');
    }
});

Given(/^I log with (.*)$/, async function (bodyValue) {
    const body = JSON.parse(this.apickli.replaceVariables(bodyValue));
    try {
        response = await this.got.put(this.apickli.domain + '/user/login', {
            json: true, // this is required
            body
        });
    } catch (err) {
        throw new Error('Server Error');
    }

    if (response.body.auth && response.body.token && response.body.user.id) {
        this.apickli.setAccessToken(response.body.token);
        this.apickli.setBearerToken();
    } else {
        throw new Error('User not created');
    }
});

Then(/^an e-mail was sent to (.*)$/, async function (destination) {
    const to = this.apickli.replaceVariables(destination);
    try {
        response = await this.got.get(config.get('base.mail.serverURL') + '/api/emails?to=' + to, {
            json: true
        });
        if(response.body.length !== 1){
            new Error('There should be one and only one email to this user')
        }
    } catch (err) {
        throw new Error('Server Error');
    }
});