import BaseService from './base.service';

export default class AuthService extends BaseService {
  async makeLogin({ email, password }) {
    try {
      const resp = await this.request().put('user/login', { email, password });
      this.store.commit('authorize', resp.data);
      return this.responseWrapper(resp, resp.data);
    } catch (error) {
      throw this.errorWrapper(error);
    }
  }

  async resetPassword({ email }) {
    try {
      await this.request().put('user/reset', { email });
      await this.makeLogout();
    } catch (error) {
      throw this.errorWrapper(error);
    }
  }

  makeLogout() {
    return new Promise((resolve, reject) => {
      try {
        this.store.commit('clearAuthorization');
      } catch (err) {
        reject(err);
      }
      resolve();
    });
  }
}
