import BaseService from './base.service';

export default class UserService extends BaseService {
  async createNewUser({ username, email, password }) {
    try {
      const resp = await this.request().post('users', { username, email, password });
      this.store.commit('authorize', resp.data);
      return this.responseWrapper(resp, resp.data);
    } catch (error) {
      throw this.errorWrapper(error);
    }
  }
}
