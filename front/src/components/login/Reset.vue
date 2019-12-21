<template>
    <div class="row">
        <div class="col-md-12">
            <form @submit.prevent="send">
                <div class="form-group">
                    <label for="forgot-email-input">Email:</label>
                    <input id="forgot-email-input" type="email" required class="form-control" placeholder="user@mathieufont.com" v-model="model.email">
                </div>

                <div class="form-group">
                    <button id="forgot-send-btn" class="btn btn-success btn-light btn-large" :disabled="isDisabled" >Send me my password</button>
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
  name: 'Reset',
  data() {
    return {
      model: {
        email: '',
      },
      loading: '',
      status: '',
    };
  },
  computed: {
    isDisabled() {
    // evaluate whatever you need to determine disabled here...
      return this.model.email.length <= 0;
    },
  },
  methods: {
    async send() {
      this.loading = 'sending mail...';
      try {
        await data.auth.resetPassword(this.model);
        this.$parent.view = 'login';
      } catch (err) {
        // do something with the error
        console.log('ERROR trying to log!', err);
      }
      this.loading = 'mail sent';
      this.status = 'Check your email box to get your new password.';
    },
  },
};
</script>
