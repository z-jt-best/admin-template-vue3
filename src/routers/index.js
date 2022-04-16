import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layout/index.vue'
import { REDIRECT_ROUTE } from './basic'

const modules = import.meta.globEager('./modules/*.js')

const routeModuleList = []
const blackList = []

Object.keys(modules).forEach(key => {
    const mod = modules[key].default || {}
    if (blackList.includes(mod.name)) {
        const modList = Array.isArray(mod) ? [...mod] : [mod]
        routeModuleList.push(...modList)
    }
})

export const constantRoutes = [
    {
        path: '/form',
        name: 'form',
        redirect: '/form/welcome',
        component: DefaultLayout,
        meta: { title: '相关示例' },
        children: [
            {
                path: 'welcome',
                name: 'welcome',
                component: () => import('@/views/welcome.vue'),
                meta: { title: 'CRUD组件示例页' }
            }
        ]
    }
]

const basicRoutes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { title: '登录页' }
    },
    REDIRECT_ROUTE
]

export const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: basicRoutes
})

export function setupRouter(app) {
    app.use(router)
}
