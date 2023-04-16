const configServer = require('config');
const config = require('@shared/config');
const MultiSwaggerService = require('./server/service');

(async () => {
  const url = configServer.get('url');
  const user = configServer.get('username');
  const pass = configServer.get('password');
  await config.load(url, user, pass);
  await new MultiSwaggerService().start();
})();
