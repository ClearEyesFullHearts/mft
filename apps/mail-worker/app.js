const configServer = require('config');
const config = require('@shared/config');
const MailWorker = require('./src/server');

const reloadOnEvent = async (server) => {
  if (server) await server.close();

  const url = configServer.get('url');
  const user = configServer.get('username');
  const pass = configServer.get('password');
  await config.load(url, user, pass);

  const newServer = new MailWorker();
  await newServer.start();

  config.once('reload', async () => {
    await reloadOnEvent(newServer);
  });
};

(async () => {
  await reloadOnEvent();
})();
