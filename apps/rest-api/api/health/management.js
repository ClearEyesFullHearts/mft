const config = require('@shared/config');

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
