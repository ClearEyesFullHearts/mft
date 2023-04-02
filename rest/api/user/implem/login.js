const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('debug');
const uuidv4 = require('uuid/v4');

const ErrorHelper = require('../../../server/error.js');

const debug = logger('mft-back:user:login');

class UserLogin {
  static async createNewUser(db, { email, username, password }) {
    debug('check for user with email:', email);
    const knownEmail = await db.users.Doc.findOne({ email });
    if (knownEmail) {
      throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.USER_EXISTS, 'User already exists');
    }
    debug('create new user');
    let newUser = new db.users.Doc();
    newUser.username = username;
    newUser.email = email;
    newUser.password = await bcrypt.hash(password, config.get('base.hashSaltRound'));
    newUser.roles = ['ROLE_USER'];

    newUser = await newUser.save();
    debug('createNewUser newUser', newUser);

    return this.changeUserToAuth(newUser);
  }

  static async saveAndSendNewPassword(db, { email }, { publisher, sessionId }) {
    const knownUser = await db.users.Doc.findOne({ email });
    if (knownUser) {
      const newPass = `${uuidv4().substr(0, 4)}-${uuidv4().substr(0, 4)}`;
      knownUser.password = await bcrypt.hash(newPass, config.get('base.hashSaltRound'));
      await knownUser.save();

      const mailValues = {
        publicURL: config.get('public.url'),
        newPassword: newPass,
        publicName: config.get('public.name'),
      };
      
      await publisher.publish('process.mail', {
        to: [knownUser.email],
        template: 'RESET_PASSWORD',
        values: mailValues,
      },
      {
        'x-session-id': sessionId
      });
      return true;
    }
    throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'User not found');
  }

  static async getAuth(db, { email, password }) {
    debug('check for user with email:', email);
    const knownUser = await db.users.Doc.findOne({ email });
    if (knownUser) {
      debug('known user');
      const isIdentified = await bcrypt.compare(password, knownUser.password);
      debug('is user identified:', isIdentified);
      if (isIdentified) {
        return this.changeUserToAuth(knownUser);
      }
    }

    throw ErrorHelper.getCustomError(401, ErrorHelper.CODE.UNKNOWN_USER, 'Unknown user');
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
    debug('changeUserToAuth payload', payload);
    payload.token = jwt.sign(payload, config.get('secret.auth'));
    return payload;
  }
}

module.exports = UserLogin;
