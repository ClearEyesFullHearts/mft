const config = require('@shared/config');
const MultiSwaggerService = require('./server/service');

(async () => {
  await config.load('http://localhost:3001', 'rest-api', 'rest-api-password');
  await new MultiSwaggerService().start();
})();
