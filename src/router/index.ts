import { createRouter, createWebHistory } from 'vue-router'
import Buy from '../views/orders/Buy.vue';
import Home from '../views/home/Index.vue';
import Sell from '../views/orders/Sell.vue';
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
        path:'/buy-order',
        name: 'buy',
        component: Buy
    },
    {
        path:'/sell-order',
        name: 'sell',
        component: Sell
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/signin/Index.vue')
    }
  ]
})

export default router