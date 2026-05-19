module.exports = {
  publicPath: '/',
  pwa: {
    name: 'MusicDA',
    themeColor: '#111111',
    msTileColor: '#111111',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      exclude: [
        /_headers$/,
        /_redirects$/,
        /\.map$/
      ]
    }
  }
}