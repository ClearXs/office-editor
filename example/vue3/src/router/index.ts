import { createRouter, createWebHistory } from 'vue-router'

import Editor from '@/pages/Editor.vue'
import Index from '@/pages/index.vue'

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/editor/:id',
    component: Editor,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
