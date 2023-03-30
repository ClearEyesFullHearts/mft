
const { Kafka } = require('kafkajs');
const config = require('config');
const logger = require('debug');
const publish = require('asyncapi-pub-middleware');

const debug = logger('log-manager:async:publisher');

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

module.exports = async (app, doc) => {
  debug('Read AsyncAPI file');
  const options = {
    tag: app.locals.appId,
    connections: {}
  }

  if(process.env.NODE_ENV !== 'dev'){
    debug('Connect to known servers');
    options.connections.garbage = await getGarbageCon();
  } else {
    debug('Publisher will create the connections');
  }

  debug('Create publisher');
  const asyncMiddleware = await publish(doc, options);
  debug('Mount publisher on app');
  app.use(asyncMiddleware)
  debug('Publisher ready');
}
