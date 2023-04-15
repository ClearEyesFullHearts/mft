const config = require('@shared/config');
const MailWorker = require('./src/server');

(async () => {
  await config.load('http://localhost:3001', 'mail-worker', 'mail-worker-password');
  await new MailWorker().start();
})();
