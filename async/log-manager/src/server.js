const fs = require('fs');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const { ValidationError } = require('asyncapi-sub-middleware');
const asyncApiPublisher = require('./middleware/mountPublisher');
const garbage = require('./middleware/garbage');
const error = require('./middleware/error');

const APP_ID = 'log-manager';

const server = rabbitExpress();
server.locals = {
  appId: APP_ID,
}

const doc = fs.readFileSync('../../mft.yaml', 'utf8');

(async function() {

  await asyncApiPublisher(server, doc);

  const options = { 
    tag: APP_ID, 
    controllers: 'controller'
  };
  await asyncApiConsumer(server, doc, options);

  server.use(garbage);
  server.use(error);
  
  server.listen({
    rabbitURI: 'amqp://myuser:mypassword@localhost:5672',
    exchange: 'logs',
  });  
})();
