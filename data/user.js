const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc'); // mongoose-auto-increment-reworked
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
        type: [String],
        enum: config.get('base.roles'),
      },
    });
  }

  async init(conn) {
    this.userSchema.plugin(autoIncrement, { model: 'User', field: 'id' });
    this.Doc = conn.model('User', this.userSchema);
    await this.Doc.init();
  }
}

module.exports = UserData;
