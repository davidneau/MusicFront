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

if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Ma Musique',
    artist: 'Mon Site',
    album: 'Playlist',
    artwork: [
      {
        src: '/cover.jpg',
        sizes: '512x512',
        type: 'image/jpeg'
      }
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => {
    player.play();
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    player.pause();
  });
}