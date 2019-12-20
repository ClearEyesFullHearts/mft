const LoginPage = require('./login/loginPage');
const LandingPage = require('./landing/landingPage');
const InfoPage = require('./infos/infoPage');

const loginPage = new LoginPage();
const landingPage = new LandingPage();
const infoPage = new InfoPage();

const pages = [
    {
        url: loginPage.url,
        name: loginPage.name,
        page: loginPage,
    },
    {
        url: landingPage.url,
        name: landingPage.name,
        page: landingPage,
    },
    {
        url: infoPage.url,
        name: infoPage.name,
        page: infoPage,
    }
]

module.exports = {
    getByName(pageName) {
        for (const p of pages) {
            if (p.name === pageName) return p.page;
        }
        return null;
    },
    getByURL(url) {
        for (const p of pages) {
            if (p.url === url) return p.page;
        }
        return null;
    },
};