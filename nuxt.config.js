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
  modules: [
    'nuxt-sass-resources-loader'
  ],
  sassResources: [
    '@/assets/sass/test.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/00-settings/reset.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/00-settings/vars.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/00-mixins/**/*.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/00-settings/colors.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/02-sections/**/*.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/11-base/**/*.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/21-atoms/**/*.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/31-molecules/**/*.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/41-organisms/**/*.scss',
//    '@/node_modules/gent_styleguide/build/styleguide/sass/61-layouts/**/*.scss'
  ]
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
