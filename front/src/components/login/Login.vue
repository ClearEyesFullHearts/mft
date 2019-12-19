<template>
    <div class="row">
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
                    <button id="login-log-btn" class="btn btn-success btn-light btn-large" >Login</button>
                    {{ loading }}
                    {{ status }}
                </div>
            </form>
        </div>
    </div>
</template>

<script>

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
  methods: {
    login() {
      console.log('trying to log!');
    },
  },
};
</script>
