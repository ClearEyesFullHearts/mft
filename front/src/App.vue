<template>
  <div id="app">
    <!-- <vue-headful title="MFT" /> -->
    <SharedHeader />
    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
      <span id="global-err-msg">{{alertMsg}}</span>
    </b-alert>
    <h1 id="global-title" class="ml-4" v-if="showTitle">{{ title }}</h1>
    <router-view class="my-3 mx-5" />
  </div>
</template>

<script>
import SharedHeader from '@/components/shared/Header.vue';

export default {
  components: {
    SharedHeader,
  },
  data() {
    return {
      title: '',
      showTitle: false,
    };
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
  watch: {
    $route(to) {
      if (to.meta.title) {
        this.showTitle = true;
        this.title = to.meta.title;
      } else {
        this.showTitle = false;
      }
    },
  },
};

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.home{
  text-align: center;
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
