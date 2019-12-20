<template>
    <div class="row">
    <vue-headful title="mft" />
        <div class="col-md-12">
            <form @submit.prevent="login">
                <div class="form-group">
                    <label for="login-email-input">Email:</label>
                    <input id="login-email-input" type="email" required class="form-control" placeholder="user@mathieufont.com" v-model="model.email">
                </div>

                <div class="form-group">
                    <label for="login-password-input">Password:</label>
                    <input id="login-password-input" type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
                </div>

                <div class="form-group">
                    <button id="login-log-btn" class="btn btn-success btn-light btn-large" :disabled="isDisabled" >Login</button>
                    {{ loading }}
                    {{ status }}
                </div>
            </form>
        </div>
    </div>
</template>

<script>

import data from '@/data';

export default {
  name: 'Login',
  data() {
    return {
      model: {
        email: '',
        password: '',
      },
      loading: '',
      status: '',
    };
  },
  computed: {
    isDisabled() {
    // evaluate whatever you need to determine disabled here...
      return this.model.email.length <= 0 || this.model.password.length <= 0;
    },
  },
  methods: {
    async login() {
      this.loading = 'Trying to connect...';
      try {
        await data.auth.makeLogin(this.model);
        this.$router.push('landing');
      } catch (err) {
        // do something with th error
        console.log('ERROR trying to log!', err);
      }
      this.loading = '';
    },
  },
};
</script>
