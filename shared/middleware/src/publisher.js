const { Kafka } = require('kafkajs');
const amqplib = require('amqplib');
const axios = require('axios');
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
  config: () => {
    const { url, authorization } = config.connection;
    return axios.create({
      baseURL: url,
      headers: { Authorization: authorization },
    });
  },
};

module.exports = async (appId, doc, usedConnection = { }) => {
  debug('Read AsyncAPI file');
  const options = {
    tag: appId,
    connections: {},
  };

  if (process.env.NODE_ENV !== 'dev') {
    const {
      rabbit: myRabbitConnection = false,
      garbage: myGarbageConnection = false,
      config: myConfigConnection = false,
    } = usedConnection;

    options.connections.rabbit = myRabbitConnection;
    options.connections.garbage = myGarbageConnection;
    options.connections.config = myConfigConnection;

    debug('Connect to known servers');
    if (!myRabbitConnection) options.connections.rabbit = await connections.rabbit();
    if (!myGarbageConnection) options.connections.garbage = await connections.garbage(appId);
    if (!myConfigConnection) options.connections.config = connections.config();
  } else {
    debug('Publisher will create the connections');
  }

  debug('Create publisher');
  const asyncMiddleware = await publish(doc, options);
  debug('Publisher ready');

  return asyncMiddleware;
};

module.exports.connections = connections;
