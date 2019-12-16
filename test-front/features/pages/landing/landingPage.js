const config = require('config');
const BasePage = require('../base');

class LandingPage extends BasePage {
    constructor(){
        super('Landing', `${config.get('public.url')}/landing`);
        this.name = 'Landing';
    }
}

module.exports = LandingPage;