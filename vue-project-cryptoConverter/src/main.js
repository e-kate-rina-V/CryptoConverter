import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia';
import router from './router.js';
import Theme from './directives/theme.js';

const app = createApp(App);

const pinia = createPinia();

app.directive('theme', Theme);

app.use(router);
app.use(pinia);
app.mount('#app');
