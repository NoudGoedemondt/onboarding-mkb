import { createRouter, createWebHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import ModuleView from './views/ModuleView.vue';
import BrancheView from './views/BrancheView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import TestView from './views/TestView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/modules', component: ModuleView },
  { path: '/branches', component: BrancheView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/test', component: TestView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
