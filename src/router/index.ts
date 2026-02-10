import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: "/event/:url",
      name: "event-detail",
      component: () => import('../views/events/event/EventDetail.vue')
    },
    {
      path: "/qr-code/",
      name: "qr-code",
      component: () => import('../views/events/event/QRCode.vue')
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/signin/Index.vue')
    }
  ]
})

export default router