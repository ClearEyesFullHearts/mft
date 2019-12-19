<template>
  <div class="home">
    <div class="container">
      <transition>
        <div v-if="view !== 'register' && view !== 'reset'">
          <Login />
          <ul class="list-inline">
            <li><a id="login-new-btn" class="list-inline-item" href="#" @click.prevent="view ='register'">Sign up!</a></li>
            <li><a id="login-forgot-btn" class="list-inline-item" href="#" @click.prevent="view ='reset'">Forgot my password</a></li>
        </ul>
        </div>
        <div v-else-if="view === 'register'">
          <Register />
          <ul class="list-inline">
            <li><a id="register-cancel-btn" class="list-inline-item" href="#" @click.prevent="view ='login'">Cancel</a></li>
        </ul>
        </div>
        <div v-else-if="view === 'reset'">
          <Reset />
          <ul class="list-inline">
            <li><a id="reset-cancel-btn" class="list-inline-item" href="#" @click.prevent="view ='login'">Cancel</a></li>
        </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/login/Login.vue';
import Register from '@/components/login/Register.vue';
import Reset from '@/components/login/Reset.vue';

export default {
  name: 'home',
  data() {
    return {
      view: 'login',
    };
  },
  components: {
    Login,
    Register,
    Reset,
  },
};

</script>
