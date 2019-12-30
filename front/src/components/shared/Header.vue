<template>
  <div v-if="isConnected">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to='/'>MFT</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="info">Server info</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="profile">{{ profileName }}</b-nav-item>
          <b-nav-item id="nav-logoff-btn" @click="logOff">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>

</template>

<script>
import data from '@/data';

export default {
  name: 'Header',
  computed: {
    profileName() {
      return this.$store.state.auth.user.username;
    },
    isConnected() {
      return this.$store.state.auth.authorized;
    },
  },
  methods: {
    async logOff() {
      try {
        await data.auth.makeLogout();
        this.$router.push('/');
      } catch (err) {
        // do something with th error
        // console.log('ERROR trying to log!', err);
      }
    },
  },
};

</script>
