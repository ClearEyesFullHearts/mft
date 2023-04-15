const config = require('@shared/config');
const logger = require('debug');

const debug = logger('log-manager:async:action:warning');

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

  const level2MailingList = config.get('destination.level2');

  await publisher.publish('process.mail', {
    to: [level2MailingList],
    template: 'ADMIN_WARNING_MAIL',
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
