<template>
  <div id="app">
    <Header />
    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
      <span id="global-err-msg">{{alertMsg}}</span>
    </b-alert>
    <router-view class="mt-3" />
  </div>
</template>

<script>
import Header from '@/components/shared/Header.vue';

export default {
  components: {
    Header,
  },
  computed: {
    showDismissibleAlert: {
      get() {
        return this.$store.state.showAlert;
      },
      set(val) {
        if (!val) {
          this.$store.commit('hideAlert');
        }
      },
    },
    alertMsg() {
      return this.$store.state.alertMessage;
    },
  },
};

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
