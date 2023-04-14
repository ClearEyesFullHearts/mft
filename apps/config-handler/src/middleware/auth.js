const config = require('config');

module.exports = (req, res, next) => {
  const users = config.get('users');

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const strauth = Buffer.from(b64auth, 'base64').toString();
  const splitIndex = strauth.indexOf(':');
  const login = strauth.substring(0, splitIndex);
  const password = strauth.substring(splitIndex + 1);

  if (users[login] === password) {
    req.auth = login;
    return next();
  }

  // Access denied...
  return res.status(401).send('Authentication required.'); // custom message
};
