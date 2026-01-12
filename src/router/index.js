import { createWebHistory, createRouter } from 'vue-router'


import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '../views/SignIn.vue'
import Playlist from '@/views/Playlist.vue'

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
    { 
        path: '/playlist', 
        component: Playlist, 
        name: 'Playlist',
        props: { userConnected: true }
    },
    { 
        path: '/signin', 
        component: SignIn, 
        name: 'SignIn',
    },
    { 
        path: '/signup', 
        component: SignUp, 
        name: 'SignUp',
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router