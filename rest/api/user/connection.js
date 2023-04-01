const logger = require('debug');
const UserLogin = require('./implem/login.js');
const UserMngt = require('./implem/user.js');

const debug = logger('mft-back:user:connection');

module.exports.createUser = (req, res, next) => {
  debug('createUser body', req.swagger.params.body.value);
  UserLogin.createNewUser(req.app.locals.db, req.swagger.params.body.value)
    .then((auth) => {
      res.statusCode = 201;
      res.json(auth);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.loginUser = (req, res, next) => {
  debug('loginUser body', req.swagger.params.body.value);
  UserLogin.getAuth(req.app.locals.db, req.swagger.params.body.value)
    .then((auth) => {
      res.json(auth);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.resetUserPassword = (req, res, next) => {
  debug('resetUserPassword body', req.swagger.params.body.value);
  UserLogin.saveAndSendNewPassword(req.app.locals.db, req.swagger.params.body.value, req.api.publisher)
    .then(() => {
      res.json();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getAllUsers = (req, res, next) => {
  debug('getAllUsers');
  UserMngt.getAll(req.app.locals.db, req.auth)
    .then((allUsers) => {
      req.monitor.output = { allUsers: allUsers.length};
      res.json(allUsers);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  debug('getUser');
  UserMngt.getOne(req.app.locals.db, req.auth, req.swagger.params.id.value)
    .then((user) => {
      req.monitor.output = user;
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  debug('updateUser');
  const ID = req.swagger.params.id.value;
  const body = req.swagger.params.body.value;
  UserMngt.changeOne(req.app.locals.db, req.auth, ID, body)
    .then((user) => {
      req.monitor.output = user;
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.removeUser = (req, res, next) => {
  debug('removeUser');
  UserMngt.removeOne(req.app.locals.db, req.auth, req.swagger.params.id.value)
    .then(() => {
      res.json();
    })
    .catch((err) => {
      next(err);
    });
};
