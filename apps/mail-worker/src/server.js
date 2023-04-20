const fs = require('fs');
const config = require('@shared/config');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const logger = require('debug');
const {
  error, garbage, publisher: asyncApiPublisher, logging: log,
} = require('@shared/middleware');

const debug = logger('mail-worker:server');
const APP_ID = 'mail-worker';

class MailWorker {
  constructor() {
    this.server = rabbitExpress();
    this.server.locals = {
      appId: APP_ID,
    };

    const fileroute = config.get('async.fileroute');
    this.doc = fs.readFileSync(`${__dirname}${fileroute}`, 'utf8');
    this.rabbitConnection = null;
  }

  async start() {
    debug('Initializing server');

    this.rabbitConnection = await asyncApiPublisher.connections.rabbit();

    const asyncMiddleware = await asyncApiPublisher(APP_ID, this.doc, { rabbit: this.rabbitConnection, garbage: false });
    this.server.use(asyncMiddleware);

    debug('Publisher mounted on app');

    this.server.use(log);

    const options = {
      tag: APP_ID,
      controllers: 'src/controller',
    };
    await asyncApiConsumer(this.server, this.doc, options);

    this.server.use(garbage);
    this.server.use(error);

    const exchange = 'worker'; // config.get('secret.rabbit.exchange');
    const queue = 'mail'; // config.get('secret.rabbit.queue');
    this.server.listen({
      rabbitURI: this.rabbitConnection,
      exchange,
      queue,
      consumerTag: APP_ID,
    });
    debug('Server listen');
  }
}

module.exports = MailWorker;
