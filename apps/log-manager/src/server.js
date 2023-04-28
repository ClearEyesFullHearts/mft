const fs = require('fs');
const config = require('@shared/config');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const logger = require('debug');
const {
  error, garbage, publisher: asyncApiPublisher,
} = require('@shared/middleware');

const debug = logger('log-manager:server');

const APP_ID = 'log-manager';

class LogManager {
  constructor() {
    this.server = rabbitExpress();
    this.server.locals = {
      appId: APP_ID,
    };

    this.rabbitConnection = null;
    this.publisher = null;
  }

  async start() {
    debug('Initializing server');

    this.rabbitConnection = await asyncApiPublisher.connections.rabbit();

    const {
      asyncMiddleware,
      publisher,
    } = await asyncApiPublisher(APP_ID, config.get('asyncApi'), { rabbit: this.rabbitConnection, garbage: false });

    this.publisher = publisher;

    this.server.use(asyncMiddleware);

    debug('Publisher mounted on app');

    const options = {
      tag: APP_ID,
      controllers: 'src/controller',
    };
    await asyncApiConsumer(this.server, config.get('asyncApi'), options);

    this.server.use(garbage);
    this.server.use(error);

    const exchange = 'logs'; // config.get('secret.rabbit.exchange');
    this.server.listen({
      rabbitURI: this.rabbitConnection,
      exchange,
      consumerOptions: { consumerTag: APP_ID },
    });
    debug('Server listen');
  }

  async close() {
    await this.server.stop(false);
    await this.publisher.stop(true);
  }
}

module.exports = LogManager;
