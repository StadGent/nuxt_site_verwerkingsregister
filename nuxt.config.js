module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'verwerkingsregister',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'http://stijlgids.web.test.gentgrp.gent.be/v3/css/main.css'
      }
    ],
    script: [
      {src: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#009de0'},
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
