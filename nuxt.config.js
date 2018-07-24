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
    extractCSS: {
      allChunks: true
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
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
      const vueLoader = config.module.rules.find(
        ({loader}) => loader === 'vue-loader');
      const {options: {loaders}} = vueLoader || {options: {}};
      if (loaders) {
        for (const loader of Object.values(loaders)) {
          changeLoaderOptions(Array.isArray(loader) ? loader : [loader]);
        }
      }
      config.module.rules.forEach(rule => changeLoaderOptions(rule.use));
    }
  },
  css: [
    '@/assets/sass/main.scss'
  ],
  /*
  ** Fix default router config to enable scroll to top
  ** See https://github.com/nuxt/nuxt.js/issues/2738
  */
  router: {
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      else {
        let position = {};
        if (to.matched.length < 2) {
          position = {x: 0, y: 0};
        }
        else {
          if (to.matched.some(r => r.components.default.options.scrollToTop)) {
            position = {x: 0, y: 0};
          }
        }
        if (to.hash) {
          position = {selector: to.hash};
        }
        return position;
      }
    }
  }
};

function changeLoaderOptions (loaders) {
  if (loaders) {
    for (const loader of loaders) {
      if (loader.loader === 'sass-loader') {
        Object.assign(loader.options, {
          includePaths: [
            'node_modules/breakpoint-sass/stylesheets',
            'node_modules/susy/sass'
          ]
        });
      }
    }
  }
}
