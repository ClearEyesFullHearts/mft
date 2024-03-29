const { Given, When, Then } = require('cucumber');
const config = require('config');
const Util = require('../support/util');

Given('I am a new user', async function () {
  const body = Util.createRandomUser();
  let response;
  try {
    response = await this.got.post(`${this.apickli.domain}/users`, {
      json: true, // this is required
      body,
    });
  } catch (err) {
    console.log(err);
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
    response = await this.got.put(`${this.apickli.domain}/user/login`, {
      json: true, // this is required
      body,
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

  await Util.retry(async () => {
    try {
      response = await this.got.get(`${config.get('base.mail.serverURL')}/api/emails?to=${to}`, {
        json: true,
      });

      if (!response || !response.body || response.body.length < 1){
        return false;
      }
  
      if (response.body.length > 1) {
        throw new Error('More than one email to this user');
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  })
});

Then(/^an e-mail containing (.*) was sent to (.*)$/, async function (content, destination) {
  const to = this.apickli.replaceVariables(destination);
  const word = this.apickli.replaceVariables(content);

  await Util.retry(async () => {
    try {
      response = await this.got.get(`${config.get('base.mail.serverURL')}/api/emails?to=${to}`, {
        json: true,
      });

      if (!response || !response.body || response.body.length < 1){
        return false;
      }
  
      if (response.body.length > 0) {
        const mail = response.body.filter((m) => {
          return m.text.search(word) >= 0;
        });
        
        if(mail.length < 1){
          return false;
        }
        if(mail.length > 1){
          throw new Error('More than one email to this user');
        }
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  })
});

Then(/^I sleep for (.*)$/, async function (seconds) {
  const time = this.apickli.replaceVariables(seconds);
  await new Promise((resolve) => {
    setTimeout(resolve, (time * 1000));
  });
});
