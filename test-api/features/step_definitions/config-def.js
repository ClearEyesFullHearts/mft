const { Given, When, Then } = require('cucumber');

Given(/^I ask for a config reload$/, async function () {
  let response;
  try {
    response = await this.got.put('http://localhost:3001/load', {
      json: true, // this is required
      headers: {
        Authorization: `Basic ${Buffer.from('admin:admin-password').toString('base64')}`,
      },
      body: {
        apps: ['*'],
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error('Server Error');
  }

  console.log(response.body);
});
