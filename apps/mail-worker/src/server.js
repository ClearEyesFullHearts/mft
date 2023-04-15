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
  }

  async start() {
    debug('Initializing server');

    const asyncMiddleware = await asyncApiPublisher(APP_ID, this.doc);
    this.server.use(asyncMiddleware);

    debug('Publisher mounted on app');

    this.server.use(log);

    const ctrl = require('./controller');

    const options = {
      tag: APP_ID,
      controllers: 'src/controller',
    };
    await asyncApiConsumer(this.server, this.doc, options);

    this.server.use(garbage);
    this.server.use(error);

    const rabbitURI = config.get('secret.rabbit.url');
    const exchange = 'worker'; // config.get('secret.rabbit.exchange');
    const queue = 'mail'; // config.get('secret.rabbit.queue');
    this.server.listen({
      rabbitURI,
      exchange,
      queue,
      consumerTag: APP_ID,
    });
    debug('Server listen');
  }
}

module.exports = MailWorker;
