import { createRouter, createWebHistory } from 'vue-router'
import Events from '../views/Events/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Events
    }
  ]
})

export default router
