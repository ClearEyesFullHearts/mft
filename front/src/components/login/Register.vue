<template>
    <div class="row">
        <div class="col-md-12">
            <form @submit.prevent="register">
                <div class="form-group">
                    <label for="register-name-input">Username:</label>
                    <input id="register-name-input" type="text" required class="form-control" placeholder="My name" v-model="model.username">
                </div>

                <div class="form-group">
                    <label for="register-email-input">Email:</label>
                    <input id="register-email-input" type="email" required class="form-control" placeholder="user@mathieufont.com" v-model="model.email">
                </div>

                <div class="form-group">
                    <label for="register-password-input">Password:</label>
                    <input id="register-password-input" type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
                </div>

                <div class="form-group">
                    <label for="register-c_password-input">Confirm password:</label>
                    <input id="register-c_password-input" type="password" required class="form-control" placeholder="Confirm Password" v-model="model.c_password">
                </div>

                <div class="form-group">
                    <button id="register-ok-btn" class="btn btn-success btn-light btn-large" :disabled="isDisabled">Register</button>
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
  name: 'Register',
  data() {
    return {
      model: {
        username: '',
        email: '',
        password: '',
        c_password: '',
      },
      loading: '',
      status: '',
    };
  },
  computed: {
    isDisabled() {
    // evaluate whatever you need to determine disabled here...
      return (this.model.email.length <= 0
              || this.model.username.length <= 0
              || this.model.password.length <= 0
              || this.model.c_password.length <= 0)
              || this.model.password !== this.model.c_password;
    },
  },
  methods: {
    async register() {
      if (this.model.password === this.model.c_password) {
        this.loading = 'Trying to connect...';
        console.log(data);
        try {
          await data.user.createNewUser(this.model);
          this.$router.push('landing');
        } catch (err) {
        // do something with th error
          console.log('ERROR trying to log!', err);
        }
        this.loading = '';
      }
    },
  },
};
</script>
