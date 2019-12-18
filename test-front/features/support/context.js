
class Context {
    constructor(){
        this._currentpage = null;
        this._currentemail = null;
        this._currentpassword = null;
    }
    get currentpage() {
        return this._currentpage;
    }
    set currentpage(page) {
        this._currentpage = page;   // validation could be checked here such as only allowing non numerical values
    }
    get currentemail() {
        return this._currentemail;
    }
    set currentemail(email) {
        this._currentemail = email;   // validation could be checked here such as only allowing non numerical values
    }
    get currentpassword() {
        return this._currentpassword;
    }
    set currentpassword(password) {
        this._currentpassword = password;   // validation could be checked here such as only allowing non numerical values
    }

    replaceVariables(resource, offset){
        const variableChar = '`';
        offset = offset || 0;
        const startIndex = resource.indexOf(variableChar, offset);
        if (startIndex >= 0) {
            const endIndex = resource.indexOf(variableChar, startIndex + 1);
            if (endIndex > startIndex) {
                const variableName = resource.substr(startIndex + 1, endIndex - startIndex - 1);
                const variableValue = this[variableName];

                resource = resource.substr(0, startIndex) + variableValue + resource.substr(endIndex + 1);
                resource = this.replaceVariables(resource, endIndex + 1);
            }
        }
        return resource;
    }
}

module.exports = Context;