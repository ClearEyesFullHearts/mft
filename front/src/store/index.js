import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const authorization = {
  state: {
    authorized: Boolean(localStorage.getItem('auth')) || false,
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {
      id: 0,
      username: '',
      email: '',
    },
    roles: JSON.parse(localStorage.getItem('roles')) || [],
  },
  mutations: {
    authorize(state, auth) {
      if (auth.auth) {
        state.authorized = auth.auth;
        localStorage.setItem('auth', auth.auth);
        state.token = auth.token;
        localStorage.setItem('token', auth.token);
        state.roles = auth.roles;
        localStorage.setItem('roles', JSON.stringify(auth.roles));
        state.user.id = auth.user.id;
        state.user.username = auth.user.username;
        state.user.email = auth.user.email;
        localStorage.setItem('user', JSON.stringify(auth.user));
      }
    },
    clearAuthorization(state) {
      state.authorized = false;
      localStorage.removeItem('auth');
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
