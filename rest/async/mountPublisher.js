
const fs = require('node:fs');
const logger = require('debug');
const publish = require('asyncapi-pub-middleware');

const debug = logger('mft-back:async:publisher');

module.exports = async (app) => {
  debug('Read AsyncAPI file');
  const asyncDoc = fs.readFileSync(`${__dirname}/../../async/mft.yaml`, 'utf8');
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
  }
  debug('Create publisher');
  const asyncMiddleware = await publish(asyncDoc, options);
  debug('Mount publisher on app');
  app.use(asyncMiddleware)
  debug('Publisher ready');
}
