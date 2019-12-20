const express = require('express');
const morgan = require('morgan');
const config = require('config');
const logger = require('debug');
const SwaggerAsync = require('./swaggerAsync.js');
const ErrorHelper = require('./error.js');
const CORS = require('./cors.js');
const Data = require('../data/index.js');

const debug = logger('mft-back:server');

class MultiSwaggerService {
  constructor() {
    this.app = express();
    this.app.use(morgan('dev')); // log every request to the console
    this.app.use(CORS.options());
    this.app.options('/*', (req, res) => res.sendStatus(200));
  }

  async start() {
    debug('STARTED');
    const host = config.get('base.instance.host');
    const port = config.get('base.instance.port');

    const swaggerApp = this.app;
    const data = new Data();

    await data.init();

    swaggerApp.locals.db = data;

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

      await SwaggerAsync.init(swaggerApp, name, doc, options);// eslint-disable-line
    }

    swaggerApp.use(ErrorHelper.catchMiddleware());

    return new Promise(((resolve) => {
      swaggerApp.listen(port, host, () => {
        debug('Your server is listening on port %d (http://%s:%d)', port, host, port);
        resolve();
      });
    }));
  }
}


module.exports = MultiSwaggerService;
