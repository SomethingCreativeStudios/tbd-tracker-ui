import Vue from 'vue';
import VueRouter from 'vue-router';
import Anime from '../views/anime.vue';
import Downloads from '../views/downloads.vue';

Vue.use(VueRouter);

const routes = [
   {
      path: '/',
      name: 'anime',
      component: Anime,
   },
   {
      path: '/downloads',
      name: 'downloads',
      component: Downloads,
   },
];

const router = new VueRouter({
   routes,
});

export default router;
