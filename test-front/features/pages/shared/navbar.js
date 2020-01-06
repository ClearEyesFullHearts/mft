const { By } = require('selenium-webdriver');

class NavBarComponent {

    constructor() {
        this.logOffButton = By.id('nav-logoff-btn');
        this.profileButton = By.id('nav-profile-btn');
    }
}

module.exports = NavBarComponent;