import { createRouter, createWebHistory } from 'vue-router';
import Converter from './components/Converter.vue';
import Home from './components/Home.vue';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/converter',
    name: 'Converter',
    component: Converter
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;