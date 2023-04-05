const config = require('config');
const logger = require('debug');

const debug = logger('log-manager:action:error');

module.exports = async (req, res) => {
  const {
    path,
    api: {
      params,
      body: { sessionId },
      publisher,
    },
    monitor: {
      sessionId: monitoringId,
    },
  } = req;
  debug(`logging for ${path}`);

  const level3MailingList = config.get('destination.level3');

  await publisher.publish('process.mail', {
    to: [level3MailingList],
    template: 'ADMIN_ERROR_MAIL',
    values: {
      app: params.app,
      sessionId,
    },
  },
  {
    'x-session-id': monitoringId,
  });
  res.end();
};
