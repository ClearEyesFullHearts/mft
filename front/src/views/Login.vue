<template>
  <div class="home">
    <div class="container">
      <transition>
        <div v-if="view !== 'register' && view !== 'reset'">
          <LoginComp />
          <ul class="list-inline">
            <li><a id="login-new-btn" class="list-inline-item" href="#"
                @click.prevent="view ='register'">Sign up!</a></li>
            <li><a id="login-forgot-btn" class="list-inline-item" href="#"
                @click.prevent="view ='reset'">Forgot my password</a></li>
          </ul>
        </div>
        <div v-else-if="view === 'register'">
          <RegisterComp />
          <ul class="list-inline">
            <li><a id="register-cancel-btn" class="list-inline-item" href="#"
                @click.prevent="view ='login'">Cancel</a></li>
          </ul>
        </div>
        <div v-else-if="view === 'reset'">
          <ResetComp />
          <ul class="list-inline">
            <li><a id="reset-cancel-btn" class="list-inline-item" href="#"
                @click.prevent="view ='login'">Cancel</a></li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginComp from '@/components/login/Login.vue';
import RegisterComp from '@/components/login/Register.vue';
import ResetComp from '@/components/login/Reset.vue';

export default {
  name: 'HomePage',
  data() {
    return {
      view: 'login',
    };
  },
  components: {
    LoginComp,
    RegisterComp,
    ResetComp,
  },
};

</script>
