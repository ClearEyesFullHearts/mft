const config = require('config');
const BasePage = require('../base');
const UserComp = require('./user');
const UsersListComp = require('./usersList');

class ProfilePage extends BasePage {
    constructor() {
        super('My Profile', `${config.get('public.url')}/profile`);
        this.name = 'profile';
        this.user = new UserComp();
        this.usersList = new UsersListComp();
    }

    get email() {
        return this.user.emailInput;
    }
    get username() {
        return this.user.usernameInput;
    }
    get password() {
        return this.user.passwordInput;
    }
    get confirmPassword() {
        return this.user.c_passwordInput;
    }
    get update() {
        return this.user.updatePasswordButton;
    }
    get remove() {
        return this.user.deleteButton;
    }

    user(id) {
        return this.usersList.userLine(id);
    }
    name(id) {
        return this.usersList.nameInput(id);
    }
    mail(id) {
        return this.usersList.emailInput(id);
    }
    deleteUser(id) {
        return this.usersList.deleteUser(id);
    }
}

module.exports = ProfilePage;