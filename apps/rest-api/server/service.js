const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const logger = require('debug');
const SwaggerAsync = require('./swaggerAsync');
const ErrorHelper = require('./error');
const CORS = require('./cors');
const Data = require('../data/index');
// const asyncPublishers = require('../async/mountPublisher');
// const log = require('./middleware/logging');
// const garbage = require('./middleware/garbage');
const {
  garbage, publisher: asyncApiPublisher, logging: log,
} = require('middleware');

const debug = logger('mft-back:server');

const APP_ID = 'rest-api';

class MultiSwaggerService {
  constructor() {
    this.app = express();
    this.app.use(morgan('dev')); // log every request to the console
    this.app.use(CORS.options());
    this.app.options('/*', (req, res) => res.sendStatus(200));

    this.app.locals.appId = APP_ID;

    const fileroute = config.get('async.fileroute');
    this.doc = fs.readFileSync(`${__dirname}${fileroute}`, 'utf8');
  }

  async start() {
    debug('STARTED');
    const port = config.get('base.instance.port');

    const data = new Data();
    await data.init();
    this.app.locals.db = data;

    const asyncMiddleware = await asyncApiPublisher(APP_ID, this.doc);
    this.app.use(asyncMiddleware);

    this.app.use(log);

    const apis = config.get('api');
    const l = apis.length;
    for (let i = 0; i < l; i += 1) {
      const {
        name,
      } = apis[i];
      const options = {
        controllers: `./api/${apis[i].name}${apis[i].controller}`,
        useStubs: process.env.NODE_ENV === 'dev', // Conditionally turn on stubs (mock mode)
      };
      const doc = require(`../api/${apis[i].name}/${apis[i].swagger}`);// eslint-disable-line

      await SwaggerAsync.init(this.app, name, doc, options);// eslint-disable-line
    }

    this.app.use(garbage);

    this.app.use(ErrorHelper.catchMiddleware());

    return new Promise(((resolve) => {
      this.app.listen(port, () => {
        debug('Your server is listening on port %d', port);
        resolve();
      });
    }));
  }
}

module.exports = MultiSwaggerService;
