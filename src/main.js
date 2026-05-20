import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister())
  })

  caches.keys().then((keys) => {
    keys.forEach((k) => caches.delete(k))
  }) 

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker enregistré :', reg))
      .catch(err => console.error('Erreur Service Worker :', err))
  });
  window.addEventListener('update', () => {
    // 🔥 important : force reload propre
    window.location.reload()
  })
}