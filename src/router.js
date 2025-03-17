import { createRouter, createWebHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import ModuleView from './views/ModuleView.vue';
import BrancheView from './views/BrancheView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import CompanyFormView from './views/CompanyFormView.vue';

import { auth } from '@/firebase';

const routes = [
  { path: '/', component: HomeView },
  { path: '/modules', component: ModuleView },
  { path: '/branches', component: BrancheView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  {
    path: '/bedrijfsinfo',
    component: CompanyFormView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
    next({ path: '/register', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
