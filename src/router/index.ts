import { createRouter, createWebHistory } from 'vue-router'
import Events from '../views/Events/Index.vue'
import Event from '../views/Events/Event.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Events
        },
        {
            path: '/activate-user-account',
            name: 'activate-user-account',
            component: () => import('../views/signup/ActivateUserAccount.vue')
        },
        {
            path: '/event/:event_id/:event_title',
            name: 'event',
            component: Event
        },
        {
            path: '/events',
            name: 'events',
            component: Events
        },
        {
            path: '/sign-in',
            name: 'sign-in',
            component: () => import('../views/signin/Index.vue')
        },
        {
            path: '/sign-up',
            name: 'sign-up',
            component: () => import('../views/signup/Index.vue')
        }
    ]
})

export default router
