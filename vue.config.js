module.exports = {
  publicPath: '/cyberpunk2077-mememaker/',

  configureWebpack:{
    devtool: 'source-map'
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-cn',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
