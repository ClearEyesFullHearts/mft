import BaseService from './base.service';

export default class AuthService extends BaseService {
  makeLogin({ email, password }) {
    return new Promise((resolve, reject) => {
      this.request().put('user/login', { email, password })
        .then((response) => {
          try {
            this.store.commit('auth/authorize', response.data);
          } catch (err) {
            reject(err);
          }
          return resolve(this.responseWrapper(response, response.data));
        }).catch(error => reject(this.errorWrapper(error)));
    });
  }

  resetPassword({ email }) {
    return new Promise((resolve, reject) => {
      this.request().put('user/reset', { email })
        .then(() => this.makeLogout()).catch(error => reject(this.errorWrapper(error)));
    });
  }

  makeLogout() {
    return new Promise((resolve, reject) => {
      try {
        this.store.commit('auth/clearAuthorization');
      } catch (err) {
        reject(err);
      }
      resolve();
    });
  }
}
