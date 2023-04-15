const config = require('@shared/config');
const logger = require('debug');

const debug = logger('log-manager:action:failure');

module.exports = async (req, res) => {
  const {
    path,
    api: {
      params,
      body: { sessionId },
      publisher,
    },
  } = req;
  debug(`logging for ${path}`);

  const level1MailingList = config.get('destination.level1');

  await publisher.publish('process.mail', {
    to: [level1MailingList],
    template: 'ADMIN_FAILURE_MAIL',
    values: {
      app: params.app,
      sessionId,
    },
  },
  {
    'x-session-id': sessionId,
  });
  res.end();
};
