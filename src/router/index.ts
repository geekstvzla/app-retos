import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Index.vue';
const ActivateUserAccount = () => import('../views/signup/ActivateUserAccount.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: "/activate-user-account",
      name: "activate-user-account",
      component: () => import('../views/signup/ActivateUserAccount.vue')
    },
    {
      path: "/event/:url",
      name: "event-detail",
      component: () => import('../views/events/event/EventDetail.vue')
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/signin/Index.vue')
    }
  ]
})

export default router