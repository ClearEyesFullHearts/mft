const { v4: uuidv4 } = require('uuid');
const logger = require('debug');

const debug = logger('async:middleware:logging');

const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  FAILURE: 'failure',
  ERROR: 'error',
};

module.exports = (req, res, next) => {
  const start = Date.now();

  const {
    path,
    headers: {
      'x-session-id': originalSessionId,
    },
    api: {
      publisher,
    },
    app: {
      locals: {
        appId,
      },
    },
  } = req;

  const pub = publisher;
  req.monitor = {
    sessionId: originalSessionId || uuidv4(),
    eventId: uuidv4(),
    input: {
      path,
    },
    type: `${appId}-error`, // default in case an error occurs before 'type' being set
  };
  debug('Monitoring object created for new request');
  res.once('finish', async () => {
    let result = 'OK';
    let severity = SEVERITY.INFO;
    const app = appId;
    const duration = Date.now() - start;

    const numStatus = Number(res.statusCode);
    if (numStatus >= 400) {
      result = 'KO';
      severity = SEVERITY.FAILURE;
    }
    if (numStatus >= 500) {
      severity = SEVERITY.ERROR;
    }

    const msg = {
      ...req.monitor,
      result,
      duration,
      status: numStatus,
    };

    debug('Publish monitoring event');
    await pub.publish(`event.${app}.${severity}`, msg);
  });
  next();
};
