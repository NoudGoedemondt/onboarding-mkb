import { createRouter, createWebHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import ModuleView from './views/ModuleView.vue';
import BrancheView from './views/BrancheView.vue';
import QuestionnaireView from './views/QuestionnaireView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/modules', component: ModuleView },
  { path: '/branches', component: BrancheView },
  { path: '/workflow', component: QuestionnaireView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
