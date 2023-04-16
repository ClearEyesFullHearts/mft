const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('debug');
const config = require('config');
const OpenApiValidator = require('express-openapi-validator');

const debug = logger('config-handler:server');

const auth = require('./middleware/auth');
const library = require('./library');

const APP_ID = 'config-handler';

class ConfigHandler {
  constructor() {
    this.app = express();
    this.app.use(morgan('dev')); // log every request to the console
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.text());
    this.app.use(bodyParser.json());

    this.app.locals.appId = APP_ID;

    this.doc = path.join(__dirname, 'spec/api.yaml');
  }

  async start() {
    debug('STARTED');

    const port = config.get('instance.port');

    await library.load();

    this.app.use(auth);

    // this.app.use('/spec', express.static(this.doc));

    //  Install the OpenApiValidator on your express app
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.doc,
        validateApiSpec: true,
        validateResponses: true, // default false
        // Provide the base path to the operation handlers directory
        operationHandlers: path.join(__dirname, 'controller'), // default false
      }),
    );

    return new Promise(((resolve) => {
      this.app.listen(port, () => {
        debug('Your server is listening on port %d', port);
        resolve();
      });
    }));
  }
}

module.exports = ConfigHandler;
