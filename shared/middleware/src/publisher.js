const { Kafka } = require('kafkajs');
const amqplib = require('amqplib');
const config = require('@shared/config');
const logger = require('debug');
const publish = require('asyncapi-pub-middleware');

const debug = logger('async:middleware:publisher');

const connections = {
  rabbit: async () => {
    const rabbitURI = config.get('secret.rabbit.url');
    const conn = await amqplib.connect(rabbitURI);
    return conn;
  },
  garbage: async (client) => {
    const brokers = config.get('secret.garbage.url');
    const kafka = new Kafka({
      clientId: client,
      brokers: [brokers],
    });

    const producer = kafka.producer();

    await producer.connect();
    return producer;
  },
};

module.exports = async (appId, doc, usedConnection = { rabbit: false, garbage: false }) => {
  debug('Read AsyncAPI file');
  const options = {
    tag: appId,
    connections: {},
  };

  if (process.env.NODE_ENV !== 'dev') {
    const {
      rabbit: myRabbitConnection,
      garbage: myGarbageConnection,
    } = usedConnection;

    options.connections.rabbit = myRabbitConnection;
    options.connections.garbage = myGarbageConnection;

    debug('Connect to known servers');
    if (!myRabbitConnection) options.connections.rabbit = await connections.rabbit();
    if (!myGarbageConnection) options.connections.garbage = await connections.garbage(appId);
  } else {
    debug('Publisher will create the connections');
  }

  debug('Create publisher');
  const asyncMiddleware = await publish(doc, options);
  debug('Publisher ready');

  return asyncMiddleware;
};

module.exports.connections = connections;
