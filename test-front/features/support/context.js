
class Context {
    constructor(){
        this._currentpage = null;
    }
    get currentpage() {
        return this._currentpage;
    }

    set currentpage(page) {
        this._currentpage = page;   // validation could be checked here such as only allowing non numerical values
    }
}

module.exports = Context;