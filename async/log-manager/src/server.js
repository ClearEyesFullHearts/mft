const fs = require('fs');
const config = require('config');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const asyncApiPublisher = require('./middleware/publisher');
const garbage = require('./middleware/garbage');
const error = require('./middleware/error');

const APP_ID = 'log-manager';

class LogManager {
  constructor() {
    this.server = rabbitExpress();
    this.server.locals = {
      appId: APP_ID,
    };

    const fileroute = config.get('async.fileroute');
    this.doc = fs.readFileSync(`${__dirname}${fileroute}`, 'utf8');
  }

  async start() {
    await asyncApiPublisher(this.server, this.doc);

    const options = {
      tag: APP_ID,
      controllers: 'src/controller',
    };
    await asyncApiConsumer(this.server, this.doc, options);

    this.server.use(garbage);
    this.server.use(error);

    const rabbitURI = config.get('secret.rabbit.url');
    const exchange = config.get('secret.rabbit.exchange');
    this.server.listen({
      rabbitURI,
      exchange,
    });
  }
}

module.exports = LogManager;
