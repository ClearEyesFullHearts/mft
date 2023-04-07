/* eslint-disable no-await-in-loop */
const { Given, When, Then } = require('cucumber');
const uuidv4 = require('uuid/v4');

Given(/^I can publish to (.*) exchange$/, async function (exchangeName) {
  this.channel = await this.rabbit.createChannel();
  this.exchange = exchangeName;
});

Given(/^I have a correct (.*) message$/, async function (target) {
  if (target === 'log') {
    const sessionId = uuidv4();
    this.apickli.storeValueInScenarioScope('mySessionId', sessionId);
    this.message = {
      sessionId,
      eventId: 'string',
      type: 'string',
      duration: 0,
      result: 'OK',
      status: 0,
      input: {},
      output: {},
    };
  }
});

When(/^I publish to (.*)$/, async function (topic) {
  this.channel.publish(
    this.exchange,
    topic,
    Buffer.from(JSON.stringify(this.message)),
  );
});

Then(/^elastic should find (.*) document for (.*)$/, async function (nbDocs, session) {
  const mySessionId = this.apickli.replaceVariables(session);
  const nb = Number(nbDocs);
  const maxRetries = 60;
  let currentTry = 0;

  while (true) {
    const result = await this.elastic.search({
      index: 'mft-log',
      body: {
        query: {
          match: {
            sessionId: mySessionId,
          },
        },
      },
    });

    const {
      body: {
        hits: {
          hits,
        },
      },
    } = result;

    if (hits.length > 0) {
      if (nb !== hits.length) {
        throw new Error(`We should find ${nbDocs} documents and found ${hits.length}`);
      }
      return;
    }

    if (currentTry < maxRetries) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      currentTry += 1;
    } else {
      throw new Error(`We should find ${nbDocs} documents and found 0`);
    }
  }
});
