const fs = require('fs');
const config = require('config');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const logger = require('debug');
const {
  error, garbage, publisher: asyncApiPublisher,
} = require('middleware');

const debug = logger('log-manager:server');

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
    debug('Initializing server');

    const asyncMiddleware = await asyncApiPublisher(APP_ID, this.doc);
    this.server.use(asyncMiddleware);

    debug('Publisher mounted on app');

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
    debug('Server listen');
  }
}

module.exports = LogManager;
