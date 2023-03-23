
const fs = require('node:fs');
const publish = require('asyncapi-pub-middleware');

module.exports = async (app) => {
  const asyncDoc = fs.readFileSync(`${__dirname}/../../async/mft.yaml`, 'utf8');
  const options = {
    tag: 'rest-api',
    connections: {}
  }
  if(process.env.NODE_ENV === 'dev'){
    options.connections = {
      rabbit: {
        createChannel: () => ({
          assertExchange: () => Promise.resolve(true),
          assertQueue: () => Promise.resolve(true),
          sendToQueue: (q, buffer, opts) => {
            console.log('logger message');
            console.log(q, buffer.toString(), opts);
          },
          publish: (exc, topic, buffer, opts) => {
            console.log('logger message');
            console.log(exc, topic, buffer.toString(), opts);
          },
        }),
      },
      garbage: {
        send: (obj) => {
          const { topic, messages } = obj;
          console.log('garbage message');
          console.log(topic, messages);
        }
      }
    }
  }
  const asyncMiddleware = await publish(asyncDoc, options);
  app.use(asyncMiddleware)
}
