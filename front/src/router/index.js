import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.getters.isUser || store.getters.isAdmin) {
        next('/landing');
      } else {
        next();
      }
    },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: 'About (me)',
    },
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import(/* webpackChunkName: "landing" */ '../views/Landing.vue'),
    meta: {
      title: 'Invoices',
      requiresUser: true,
    },
  },
  {
    path: '/info',
    name: 'information',
    component: () => import(/* webpackChunkName: "info" */ '../views/Info.vue'),
    meta: {
      title: 'Informations',
      requiresAdmin: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next();
    } else if (store.getters.isUser) {
      next('/landing');
    } else {
      next('/');
    }
  } else if (to.matched.some(record => record.meta.requiresUser)) {
    if (store.getters.isAdmin || store.getters.isUser) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
