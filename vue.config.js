const { defineConfig } = require('@vue/cli-service')

module.exports = {
  transpileDependencies: true,
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      globPatterns: ["**/*.{html,js,css,png,svg}"],
      globIgnores: ["**/_redirects"] // 👈 ICI
    }
  },
};
