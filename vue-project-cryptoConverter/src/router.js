import { createRouter, createWebHistory } from 'vue-router';
import Converter from './components/Converter.vue';
import Home from './components/Home.vue';

const routes = [
  {
    path: '/converter',
    name: 'Converter',
    component: Converter,
    meta: { title: 'CryptoSelector' },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;