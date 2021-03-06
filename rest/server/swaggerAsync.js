
const swaggerTools = require('swagger-tools');
const config = require('config');
const logger = require('debug');
const AuthMiddleware = require('./auth.js');

class SwaggerAsync {
  static init(swagApp, apiName, swaggerDoc, routeOptions, docPath = '/api-docs') {
    return new Promise(((resolve, reject) => {
      const debug = logger(`mft-back:server:swagger-async:${apiName}`);

      // Initialize the Swagger middleware
      swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        try {
          debug('initialize swagger');
          // Interpret Swagger resources and attach metadata to request
          // - must be first in swagger-tools middleware chain
          swagApp.use(middleware.swaggerMetadata());

          // Provide the security handlers
          swagApp.use(AuthMiddleware.verify(config.get('secret.auth')));

          // Validate Swagger requests
          swagApp.use(middleware.swaggerValidator());

          // Route validated requests to appropriate controller
          swagApp.use(middleware.swaggerRouter(routeOptions));

          // Serve the Swagger documents and Swagger UI
          swagApp.use(middleware.swaggerUi({
            apiDocs: docPath,
          }));

          debug('swagger ok');
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }));
  }
}


module.exports = SwaggerAsync;
