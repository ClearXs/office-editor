import { createRouter, createWebHistory } from 'vue-router';

import Editor from '@/pages/RouteEditor.vue';
import Index from '@/pages/index.vue';
import UrlEditor from '@/pages/UrlEditor.vue';

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/editor/:id',
    component: Editor,
  },
  {
    path: '/urleditor/:id',
    component: UrlEditor,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
