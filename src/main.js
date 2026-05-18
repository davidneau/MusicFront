import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(router)
app.mount('#app')

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/registerServiceWorker.js")
    .then(() => console.log("SW enregistré"))
    .catch(err => console.error("SW error", err));
}

export default app