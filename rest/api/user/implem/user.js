const bcrypt = require('bcrypt');
const config = require('config');
const logger = require('debug');

const ErrorHelper = require('../../../server/error.js');

const debug = logger('mft-back:user:management');

class UserManagement {
  static async getAll(db, auth) {
    debug('get all users');
    if (auth.roles.indexOf('ROLE_ADMIN') >= 0) {
      const users = await db.users.Doc.find({});
      return users.map(this.toTransportUser);
    }
    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.BAD_ROLE, 'User role is not authorized for this route');
  }

  static async getOne(db, auth, id) {
    if (auth.user.id !== id) {
      if (auth.roles.indexOf('ROLE_ADMIN') < 0) {
        throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
      }
    }
    const knownUser = await db.users.Doc.findOne({ id });
    if (knownUser) {
      return this.toTransportUser(knownUser);
    }
    throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'User not found');
  }

  static async changeOne(db, auth, id, { username, password }) {
    if (auth.user.id === id) {
      const knownUser = await db.users.Doc.findOne({ id });
      if (knownUser) {
        if (username) {
          knownUser.username = username;
        }
        if (password) {
          knownUser.password = await bcrypt.hash(password, config.get('base.hashSaltRound'));
        }
        const changedUser = await knownUser.save();
        return this.toTransportUser(changedUser);
      }
      throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'User not found');
    }

    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }

  static async removeOne(db, auth, id) {
    const itsMe = auth.user.id === id;
    const iamAdmin = auth.roles.indexOf('ROLE_ADMIN') >= 0;
    if ((itsMe && !iamAdmin) || (iamAdmin && !itsMe)) {
      const knownUser = await db.users.Doc.deleteOne({ id });
      if (knownUser) {
        // remove user invoices too
        await db.invoices.Doc.deleteMany({ user: id });
        return true;
      }
      throw ErrorHelper.getCustomError(404, ErrorHelper.CODE.NOT_FOUND, 'User not found');
    }

    throw ErrorHelper.getCustomError(403, ErrorHelper.CODE.UNAUTHORIZED, 'User is not authorized for this action');
  }


  static toTransportUser({ id, username, email }) {
    return {
      id,
      username,
      email,
    };
  }
}

module.exports = UserManagement;
