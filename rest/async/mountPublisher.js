
const fs = require('fs');
const amqplib = require('amqplib');
const { Kafka } = require('kafkajs');
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
    clientId: client,
    brokers: [brokers],
  });

  const producer = kafka.producer();

  await producer.connect();
  return producer;
}

module.exports = async (app) => {
  debug('Read AsyncAPI file');
  const fileroute = config.get('async.fileroute');
  const asyncDoc = fs.readFileSync(`${__dirname}${fileroute}`, 'utf8');
  const options = {
    tag: app.locals.appId,
    connections: {}
  }

  if(process.env.NODE_ENV !== 'dev'){
    debug('Connect to known servers');
    options.connections.rabbit = await getRabbitCon();
    options.connections.garbage = await getGarbageCon();
  } else {
    debug('Publisher will create the connections');
  }

  debug('Create publisher');
  const asyncMiddleware = await publish(asyncDoc, options);
  debug('Mount publisher on app');
  app.use(asyncMiddleware)
  debug('Publisher ready');
}
