import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const authorization = {
  state: {
    authorized: localStorage.getItem('token') !== undefined || false,
    token: localStorage.getItem('token') || '',
    roles: JSON.parse(localStorage.getItem('roles')) || [],
    user: JSON.parse(localStorage.getItem('user')) || {
      id: 0,
      username: '',
      email: '',
    },
  },
  mutations: {
    authorize(state, auth) {
      if (auth.auth) {
        state.authorized = auth.auth;
        state.token = auth.token;
        localStorage.setItem('token', auth.token);
        state.roles = auth.roles;
        localStorage.setItem('roles', auth.roles);
        state.user.id = auth.user.id;
        state.user.username = auth.user.username;
        state.user.email = auth.user.email;
        localStorage.setItem('user', auth.user);
      }
    },
    clearAuthorization(state) {
      state.authorized = false;
      state.token = '';
      localStorage.removeItem('token');
      state.roles = [];
      localStorage.removeItem('roles');
      state.user.id = 0;
      state.user.username = '';
      state.user.email = '';
      localStorage.removeItem('user');
    },
  },
  actions: {

  },
  getters: {
    isUser: state => state.authorized && state.roles.indexOf('ROLE_USER') >= 0,
    isAdmin: state => state.authorized && state.roles.indexOf('ROLE_ADMIN') >= 0,
  },
};

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: authorization,
  },
});
