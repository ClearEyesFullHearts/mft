const fs = require('fs');
const config = require('config');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const asyncApiPublisher = require('./middleware/publisher');
const garbage = require('./middleware/garbage');
const error = require('./middleware/error');

const APP_ID = 'log-manager';

const server = rabbitExpress();
server.locals = {
  appId: APP_ID,
}

const doc = fs.readFileSync(`${__dirname}/../../mft.yaml`, 'utf8');

(async function() {

  await asyncApiPublisher(server, doc);

  const options = { 
    tag: APP_ID, 
    controllers: 'src/controller'
  };
  await asyncApiConsumer(server, doc, options);

  server.use(garbage);
  server.use(error);
  
  const rabbitURI = config.get('secret.rabbit.url');
  const exchange = config.get('secret.rabbit.exchange');
  server.listen({
    rabbitURI,
    exchange,
  });  
})();
