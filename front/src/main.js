import Vue from 'vue';
import vueHeadful from 'vue-headful';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.component('vue-headful', vueHeadful);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
