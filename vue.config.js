module.exports = {
  publicPath: '/',
  pwa: {
    name: 'MyApp',

    // ⚡ IMPORTANT : contrôle SW propre
    workboxOptions: {
      // 🔥 Force activation immédiate du nouveau SW
      skipWaiting: true,
      clientsClaim: true,

      // 🧠 IMPORTANT : empêche les JS/CSS d'être remplacés par index.html
      navigateFallback: '/index.html',

      navigateFallbackDenylist: [
        /\/api\//,
        /\/js\//,
        /\/css\//,
        /\/img\//,
        /.*\.(js|css|map|png|jpg|jpeg|svg|ico|webp|woff2?)$/
      ],

      // 📦 Cache uniquement ce qui est safe (assets buildés)
      globPatterns: [
        '**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff2}'
      ],

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