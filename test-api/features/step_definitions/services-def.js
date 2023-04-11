/* eslint-disable no-await-in-loop */
const { Given, When, Then } = require('cucumber');
const uuidv4 = require('uuid/v4');
const Util = require('../support/util');

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
  console.log('mySessionId', mySessionId);

  await Util.retry(async () => {
    const result = await this.elastic.search({
      index: 'mft-log',
      body: {
        query: {
          match_phrase: {
            sessionId: mySessionId,
          },
          // bool: {
          //   must: {
          //     match: {
          //       sessionId: {
          //         raw: mySessionId,
          //       },
          //     },
          //   },
          // },
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
      console.log(JSON.stringify(hits, null, 2));
      if (nb !== hits.length) {
        throw new Error(`We should find ${nbDocs} documents and found ${hits.length}`);
      }
      return true;
    }
    return false;
  });
});
