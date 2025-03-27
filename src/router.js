import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase';

const routes = [
  { path: '/', component: () => import('./views/HomeView.vue') },
  { path: '/modules', component: () => import('./views/ModuleView.vue') },
  { path: '/branches', component: () => import('./views/BrancheView.vue') },
  { path: '/login', component: () => import('./views/LoginView.vue') },
  { path: '/register', component: () => import('./views/RegisterView.vue') },
  {
    path: '/profile',
    component: () => import('./views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding',
    component: () => import('./views/onboarding/OnboardingShellView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'company-info',
        name: 'CompanyInfo',
        component: () => import('./views/onboarding/CompanyFormView.vue'),
      },
      {
        path: 'usage-info',
        name: 'UsageInfo',
        component: () => import('./views/onboarding/UsageInfoView.vue'),
      },
      {
        path: 'workflow-questions',
        name: 'WorkflowQuestions',
        component: () => import('./views/onboarding/WorkflowQuestionsView.vue'),
      },
      {
        path: 'summary',
        name: 'Summary',
        component: () => import('./views/onboarding/WorkflowSummaryView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('./views/NotFound.vue'),
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
