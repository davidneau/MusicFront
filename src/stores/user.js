import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userConnected: localStorage.getItem('userConnected') === 'true'
    }),

    actions: {
        login() {
            this.userConnected = true
            localStorage.setItem('userConnected', 'true')
        },

        logout() {
            this.userConnected = false
            localStorage.setItem('userConnected', 'false')
        }
    }
})