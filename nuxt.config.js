export default {
  modules: [
    '@nuxtjs/robots'
  ],
  /*
   ** Robots.txt
   */
  robots: () => {
    if (process.env.DEPLOY_ENV !== 'production') {
      return {
        UserAgent: '*',
        Disallow: '/'
      }
    }
    /*
     * Todo: allow indexation in production mode after official release.
     */
    return {
      UserAgent: '*',
      Disallow: '/'
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Verwerkingsregister',
    htmlAttrs: {
      lang: 'nl'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'De Stad en het OCMW Gent vinden de bescherming van jouw persoonsgegevens erg belangrijk.\n' +
          'Daarom vind je op deze pagina een overzicht van de verwerkingen van persoonsgegevens die we uitvoeren.'
      },
      { name: 'msapplication-TileColor', content: '#009DE0' },
      { name: 'theme-color', content: '#009DE0' }
    ],
    script: [
      { src: `https://polyfill.io/v3/polyfill.js?features=es5,es6,es7&flags=gated`, body: true }
    ],
    link: [
      {
        rel: 'apple',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest'
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg'
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ],
    bodyAttrs: {
      class: 'cs--cyan'
    }
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#009de0' },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue|scss)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    postcss: {
      postcssOptions: {
        'postcss-custom-properties': false
      }
    },
    /*
     ** Add sass loader
     */
    extend (config) {
      config.module.rules.push({
        test: /\.scss$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                'node_modules/breakpoint-sass/stylesheets'
              ]
            }
          }
        ]
      })
    }
  },
  css: ['@/assets/sass/main.scss'],
  plugins: [{ src: '~plugins/webFontLoader.js', ssr: false }],
  /*
   ** Add google-analytics
   */
  // buildModules: [
  //  ['@nuxtjs/google-analytics', { id: 'UA-791237-60' }]
  // ],
  env: {
    deployEnv: process.env.DEPLOY_ENV
  }
}
