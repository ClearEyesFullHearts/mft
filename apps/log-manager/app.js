const configServer = require('config');
const config = require('@shared/config');
const LogManager = require('./src/server');

(async () => {
  const url = configServer.get('url');
  const user = configServer.get('username');
  const pass = configServer.get('password');

  await config.load(url, user, pass);

  let server = new LogManager();
  await server.start();

  config.addListener('reload', async () => {
    await server.close();

    await config.load(url, user, pass);

    server = new LogManager();
    await server.start();
  });
})();
