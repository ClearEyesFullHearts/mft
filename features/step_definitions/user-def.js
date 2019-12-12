const { Given, When, Then } = require('cucumber');
const uuidv4 = require('uuid/v4');

Given("I am a new user", async function () {
    const uniqueMail = `${uuidv4()}@mathieufont.com`;
    const body = {
        username: 'testUser',
        email: uniqueMail,
        password: 'testtesttest'
    };
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