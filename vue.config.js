module.exports = {
  publicPath: '/',
  pwa: {
    name: 'MyApp',

    // ⚡ IMPORTANT : contrôle SW propre
    workboxOptions: {
      // 🔥 Force activation immédiate du nouveau SW
      skipWaiting: true,
      clientsClaim: true,
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/.*\.(js|css|map|png|jpg|jpeg|svg|ico)$/],

      // 🧹 Évite accumulation de vieux caches
      cleanupOutdatedCaches: true,

      // ⚡ Runtime caching (optionnel mais safe)
      runtimeCaching: [
        {
          urlPattern: /\/api\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5 // 5 min
            }
          }
        }
      ]
    },

    // 🔥 recommandé en prod
    themeColor: '#000000',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}