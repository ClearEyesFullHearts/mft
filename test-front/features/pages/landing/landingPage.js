const config = require('config');
const BasePage = require('../base');
const NavbarComp = require('../shared/navbar');

class LandingPage extends BasePage {
    constructor(){
        super('Landing', `${config.get('public.url')}/landing`);
        this.name = 'landing';
        this.navbar = new NavbarComp();
    }

    get logOut() {
        return this.navbar.logOffButton;
    }
}

module.exports = LandingPage;