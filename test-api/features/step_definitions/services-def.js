/* eslint-disable no-await-in-loop */
const { Given, When, Then } = require('cucumber');
const { Kafka, logLevel } = require('kafkajs');
const config = require('config');
const uuidv4 = require('uuid/v4');
const Util = require('../support/util');

Given(/^I am listening to Kafka on topic (.*)$/, async function (topic) {
  const brokers = config.get('secret.garbage.url');
  const client = config.get('secret.garbage.clientId');
  const kafka = new Kafka({
    clientId: client,
    brokers: [brokers],
    logLevel: logLevel.NOTHING,
  });
  this.kafkaConsumer = kafka.consumer({ groupId: uuidv4() });
  await this.kafkaConsumer.connect();
  await this.kafkaConsumer.subscribe({ topics: [topic], fromBeginning: false });

  await this.kafkaConsumer.run({
    eachMessage: async (kafkaMessage) => {
      const { message } = kafkaMessage;
      this.kafkaResult.push(message.value.toString());
      return Promise.resolve();
    },
  });
});

Given(/^I can publish to (.*) exchange$/, async function (exchangeName) {
  this.channel = await this.rabbit.createChannel();
  this.exchange = exchangeName;
});

Given(/^I have a correct (.*) message$/, async function (target) {
  if (target === 'log') {
    const event = Util.createRandomEvent();
    this.apickli.storeValueInScenarioScope('mySessionId', event.sessionId);
    this.message = event;
  }
  if (target === 'mail') {
    const mail = Util.createRandomMail();
    this.apickli.storeValueInScenarioScope('mailTarget', mail.to[0]);
    this.apickli.storeValueInScenarioScope('mySessionId', mail.values.sessionId);
    this.message = mail;
  }
});

Given(/^I have a wrong (.*) message$/, async function (target) {
  if (target === 'log') {
    const event = Util.createRandomEvent();
    event.type = undefined;
    delete event.type;
    this.apickli.storeValueInScenarioScope('mySessionId', event.sessionId);
    this.message = event;
  }
  if (target === 'mail') {
    const mail = Util.createRandomMail();
    this.apickli.storeValueInScenarioScope('mailTarget', mail.to[0]);
    this.apickli.storeValueInScenarioScope('mySessionId', mail.values.sessionId);
    mail.template = 'WRONG_WRONG_WRONG';
    this.message = mail;
  }
});

When(/^I publish to (.*)$/, async function (topic) {
  const mySessionId = this.apickli.replaceVariables('`mySessionId`');

  this.channel.publish(
    this.exchange,
    topic,
    Buffer.from(JSON.stringify(this.message)),
    {
      headers: {
        'x-session-id': mySessionId,
      },
    },
  );
});

Then(/^elastic should find (.*) document for (.*)$/, async function (nbDocs, session) {
  const mySessionId = this.apickli.replaceVariables(session);
  const nb = Number(nbDocs);

  await Util.retry(async () => {
    const result = await this.elastic.search({
      index: 'mft-log',
      body: {
        query: {
          match_phrase: {
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
      if (nb > hits.length) {
        return false;
      }
      return true;
    }
    return false;
  }, 60, 500);
});

Then(/^I should receive (.*) trash from (.*)$/, async function (nb, receiver) {
  await Util.retry(async () => {
    if (this.kafkaResult.length < nb) {
      return Promise.resolve(false);
    }
    const [strTrash] = this.kafkaResult;
    const trash = JSON.parse(strTrash);

    if (trash.receiver !== receiver) {
      throw new Error('Wrong receiver in the trash');
    }

    return Promise.resolve(true);
  });
});
