const config = require('@shared/config');

const ErrorHelper = require('../../server/error');

module.exports.health = (req, res) => {
  req.monitor.output = {
    status: 'UP',
  };

  res.json({
    status: 'UP',
  });
};

module.exports.info = (req, res) => {
  const output = {
    profile: process.env.NODE_ENV,
    user: req.auth,
    'config-base': config.get('base'),
    'config-api': config.get('api'),
  };
  req.monitor.output = output;
  res.json(output);
};

module.exports.reloadConfig = async (req, res, next) => {
  const {
    api: { publisher },
    monitor: {
      sessionId,
    },
  } = req;
  try {
    await publisher.publish('/load', { apps: ['*'] }, { 'x-session-id': sessionId });

    req.monitor.output = {};
    res.status(200).send();
  } catch (err) {
    next(ErrorHelper.getCustomError(500, ErrorHelper.CODE.EXTERNAL_SERVER_ERROR, 'Error on publishing'));
  }
};
