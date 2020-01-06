const { By } = require('selenium-webdriver');

class UsersListComponent {

    userLine(id){
        return By.id(`user-${id}`);
    }
    nameInput(id) {
        return By.id(`user-name-${id}`);
    }
    emailInput(id) {
        return By.id(`user-email-${id}`);
    }
    deleteButton(id) {
        return By.id(`user-delete-${id}`);
    }

}

module.exports = UsersListComponent;