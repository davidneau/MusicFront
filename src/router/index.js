import { createWebHistory, createRouter } from 'vue-router'


import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'

const routes = [
    { 
        path: '/', 
        component: LoginView, 
        name: 'Login'
    },
    { 
        path: '/home', 
        component: HomeView, 
        name: 'Home',
        props: { userConnected: true }
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router