<template>
  <div>
    <b-card class="mt-3">
      <b-form>
        <b-form-group id="input-group-1" label="Email address:" label-for="user-email-input"
          description="We'll never share your email with anyone else.">
          <b-form-input id="user-email-input" v-model="email" type="email" disabled>
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your Username:" label-for="input-2">
          <UpdatableText id="user-name" v-on:validateChange-user-name="changeUsername" v-model="form.name"></UpdatableText>
        </b-form-group>

        <div v-if="form.showPassword">
            <b-form-group id="input-group-3" label="New Password:" label-for="user-password-input">
              <b-form-input id="user-password-input" v-model="form.password" type="password">
              </b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Confirm Password:" label-for="user-c_password-input">
              <b-form-input id="user-c_password-input" v-model="form.c_password" type="password">
              </b-form-input>
            </b-form-group>
          </div>

        <b-button class="mr-2" id="user-update-btn" @click.prevent="changePassword" variant="info" :disabled="updateDisabled">Update Password
        </b-button>
        <b-button v-if="form.showPassword" id="user-cancel-btn" @click.prevent="form.showPassword = false; form.password = ''; form.c_password = '';" variant="secondary">Cancel
        </b-button>
        <b-button :disabled="isAdmin" id="user-delete-btn" @click.prevent="remove" class="float-right" variant="danger">
          Delete me!</b-button>
      </b-form>
    </b-card>
  </div>
</template>
<script>
import data from '@/data';
import UpdatableText from '@/components/shared/ui/UpdatableText.vue';

export default {
  name: 'UserComp',
  components: {
    UpdatableText,
  },
  data() {
    return {
      form: {
        name: this.$store.state.auth.user.username,
        showPassword: false,
        password: '',
        c_password: '',
      },
    };
  },
  computed: {
    email() {
      return this.$store.state.auth.user.email;
    },
    updateDisabled() {
      return this.form.showPassword && (this.form.password.length <= 0
                                            || this.form.c_password.length <= 0
                                            || this.form.password !== this.form.c_password);
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  methods: {
    async changePassword() {
      if (this.form.showPassword && !this.updateDisabled) {
        try {
          await data.user.modifyUser({ id: this.$store.state.auth.user.id, password: this.form.password });
          this.form.showPassword = false;
          this.form.password = '';
          this.form.c_password = '';
        } catch (err) {
          if (err.status && err.status === 403) {
            this.$store.commit('showAlert', 'This email address is already used');
          }
        }
      } else {
        this.form.showPassword = true;
      }
    },
    async changeUsername(name) {
      try {
        this.$store.commit('changeUser', { username: name });
        await data.user.modifyUser({ id: this.$store.state.auth.user.id, username: name });
      } catch (err) {
        this.$store.commit('changeUser', { username: this.form.name });
      }
    },
    async remove() {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Do you really want to delete yourself?')) {
        try {
          await data.user.deleteUser(this.$store.state.auth.user.id);
          if (!this.$store.getters.isAdmin) {
            this.$store.commit('clearAuthorization');
            this.$router.push('/');
          }
        } catch (err) {
          this.$store.commit('showAlert', err.message);
        }
      }
    },
  },
};

</script>
