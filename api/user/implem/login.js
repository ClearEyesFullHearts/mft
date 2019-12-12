const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('debug');

const ErrorHelper = require('../../../server/error.js');

const debug = logger('mft-back:user:login');

class UserLogin {
  static async createNewUser(db, body) {
    const knownEmail = await db.users.Doc.findOne({ email: body.email });
    if (knownEmail) {
      throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.KNOWN_EMAIL, 'Email already exists');
    }
    let newUser = new db.users.Doc();
    newUser.username = body.username;
    newUser.email = body.email;
    newUser.password = await bcrypt.hash(body.password, config.get('base.hashSaltRound'));
    newUser.roles = ['ROLE_USER'];

    newUser = await newUser.save();
    debug('createNewUser newUser', newUser);

    return this.changeUserToAuth(newUser);
  }

  static changeUserToAuth(usr) {
    const payload = {
      auth: true,
      roles: usr.roles,
      user: {
        id: usr.id,
        username: usr.username,
        email: usr.email,
      },
    };
    payload.token = jwt.sign(payload, config.get('auth.secret'));
    debug('changeUserToAuth payload', payload);
    return payload;
  }
}

module.exports = UserLogin;
