const { defineConfig } = require('@vue/cli-service')

module.exports = {
  transpileDependencies: true,
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './public/service-worker.js', // Utilise votre propre fichier comme source
    },
  },
};
