import BaseService from './base.service';

export default class UserService extends BaseService {
  createNewUser({ username, email, password }) {
    return new Promise((resolve, reject) => {
      this.request().post('users', { username, email, password })
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
}
