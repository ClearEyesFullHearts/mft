
const fs = require('fs');
const amqplib = require('amqplib');
const { Kafka, logLevel } = require('kafkajs');
const config = require('config');
const logger = require('debug');
const publish = require('asyncapi-pub-middleware');

const debug = logger('mft-back:async:publisher');

async function getRabbitCon(){
  const rabbitURI = config.get('secret.rabbit.url');
  const conn = await amqplib.connect(rabbitURI);
  return conn;
}

async function getGarbageCon(){
  const brokers = config.get('secret.garbage.url');
  const client = config.get('secret.garbage.clientId');
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    clientId: client,
    brokers: [brokers],
  });

  const producer = kafka.producer();

  await producer.connect();
  return producer;
}

module.exports = async (app) => {
  debug('Read AsyncAPI file');
  const asyncDoc = fs.readFileSync(`${__dirname}/mft.yaml`, 'utf8');
  const options = {
    tag: 'rest-api',
    connections: {}
  }

  if(process.env.NODE_ENV === 'dev'){
    debug('Set mock connections');
    options.connections = {
      rabbit: {
        createChannel: () => ({
          assertExchange: () => Promise.resolve(true),
          assertQueue: () => Promise.resolve(true),
          sendToQueue: (q, buffer, opts) => {
            console.log('rabbit send message to queue');
            console.log(q, buffer.toString(), opts);
          },
          publish: (exc, topic, buffer, opts) => {
            console.log('rabbit publish message');
            console.log(exc, topic, buffer.toString(), opts);
          },
        }),
      },
      garbage: {
        send: (obj) => {
          const { topic, messages } = obj;
          console.log('garbage send message');
          console.log(topic, messages);
        }
      }
    }
  } else {
    options.connections.rabbit = await getRabbitCon();
    options.connections.garbage = await getGarbageCon();
  }
  debug('Create publisher');
  const asyncMiddleware = await publish(asyncDoc, options);
  debug('Mount publisher on app');
  app.use(asyncMiddleware)
  debug('Publisher ready');
}
