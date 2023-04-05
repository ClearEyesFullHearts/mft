const { Kafka } = require('kafkajs');
const amqplib = require('amqplib');
const config = require('config');
const logger = require('debug');
const publish = require('asyncapi-pub-middleware');

const debug = logger('async:middleware:publisher');

async function getRabbitCon() {
  const rabbitURI = config.get('secret.rabbit.url');
  const conn = await amqplib.connect(rabbitURI);
  return conn;
}

async function getGarbageCon() {
  const brokers = config.get('secret.garbage.url');
  const client = config.get('secret.garbage.clientId');
  const kafka = new Kafka({
    clientId: client,
    brokers: [brokers],
  });

  const producer = kafka.producer();

  await producer.connect();
  return producer;
}

module.exports = async (appId, doc, usedConnection = { rabbit: true, garbage: true }) => {
  debug('Read AsyncAPI file');
  const options = {
    tag: appId,
    connections: {},
  };

  const {
    rabbit: createRabbitConnection,
    garbage: createGarbageConnection,
  } = usedConnection;

  if (process.env.NODE_ENV !== 'dev') {
    debug('Connect to known servers');
    if (createRabbitConnection) options.connections.rabbit = await getRabbitCon();
    if (createGarbageConnection) options.connections.garbage = await getGarbageCon();
  } else {
    debug('Publisher will create the connections');
  }

  debug('Create publisher');
  const asyncMiddleware = await publish(doc, options);
  debug('Publisher ready');

  return asyncMiddleware;
};
