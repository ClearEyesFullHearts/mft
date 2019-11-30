
const config = require('config');

module.exports.health = (req, res) => {
  res.json({
    status: 'UP',
  });
};

module.exports.info = (req, res) => {
  res.json({
    profile: process.env.NODE_ENV,
    user: req.auth,
    'config-base': config.get('base'),
    'config-api': config.get('api'),
  });
};
