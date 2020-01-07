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

  async modifyUser({ id, username, password }) {
    try {
      const resp = await this.request().put(`user/${id}`, { username, password });
      this.store.commit('changeUser', { username: resp.data.username });
      return this.responseWrapper(resp, resp.data);
    } catch (error) {
      throw this.errorWrapper(error);
    }
  }

  async deleteUser(id) {
    if (this.store.getters.isAdmin || (this.store.state.auth.user.id === id)) {
      try {
        const resp = await this.request().delete(`user/${id}`);
        return this.responseWrapper(resp, resp.data);
      } catch (error) {
        throw this.errorWrapper(error);
      }
    }
    const err = {
      response: {
        status: 403,
        data: {
          success: false,
        },
      },
    };
    throw this.errorWrapper(err, 'You Can\'t do that');
  }
}
