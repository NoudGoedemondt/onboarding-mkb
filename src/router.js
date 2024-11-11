import { createRouter, createMemoryHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import ModuleView from './views/ModuleView.vue';
import BrancheView from './views/BrancheView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/modules', component: ModuleView },
  { path: '/branches', component: BrancheView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
