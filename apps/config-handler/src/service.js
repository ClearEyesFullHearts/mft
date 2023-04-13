const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('debug');
const OpenApiValidator = require('express-openapi-validator');

const debug = logger('config-handler:server');

const APP_ID = 'config-handler';
const PORT = 3001;

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

    // this.app.use('/spec', express.static(this.doc));

    //  Install the OpenApiValidator on your express app
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.doc,
        validateResponses: true, // default false
        // Provide the base path to the operation handlers directory
        operationHandlers: path.join(__dirname, 'controller/api'), // default false
      }),
    );

    return new Promise(((resolve) => {
      this.app.listen(PORT, () => {
        debug('Your server is listening on port %d', PORT);
        resolve();
      });
    }));
  }
}

module.exports = ConfigHandler;
