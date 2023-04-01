
const MailWorker = require('./src/server');

(async () => {
    await new MailWorker().start();
})();
