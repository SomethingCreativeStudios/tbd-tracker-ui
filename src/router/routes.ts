import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Shows.vue') },
      { path: 'shows', component: () => import('pages/Shows.vue') },
      { path: 'downloads', component: () => import('pages/Downloads.vue') },
      { path: 'western-shows', component: () => import('pages/WesternShows.vue') },
      { path: 'movies', component: () => import('pages/Movies.vue') },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
