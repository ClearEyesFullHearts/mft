const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('config');

class UserData {
  constructor() {
    this.userSchema = new mongoose.Schema({
      id: Number,
      username: String,
      email: {
        type: String,
        unique: true,
      },
      password: String,
      roles: {
        type: String,
        enum: config.get('base.roles'),
      },
    });
  }

  async init(conn) {
    this.userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id' });
    this.doc = conn.model('User', this.userSchema);
    await this.doc.init();
  }
}

module.exports = UserData;
