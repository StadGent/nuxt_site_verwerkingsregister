export default {
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
          'De Stad en het OCMW Gent vinden de bescherming van uw persoonsgegevens erg belangrijk.\n' +
          'Daarom vindt u op deze pagina een overzicht van de verwerkingen van persoonsgegevens die we uitvoeren.'
      },
      { name: 'msapplication-TileColor', content: '#009DE0' },
      { name: 'theme-color', content: '#009DE0' }
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
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#009de0' },
  /*
   ** Build configuration
   */
  build: {
    vendor: [
      'babel-polyfill'
    ],
    extractCSS: {
      allChunks: true
    },
    postcss: {
      plugins: {
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
                'node_modules/breakpoint-sass/stylesheets',
                'node_modules/susy/sass'
              ]
            }
          }
        ]
      })
    }
  },
  css: ['@/assets/sass/main.scss'],
  plugins: [{ src: '~plugins/webFontLoader.js', ssr: false }],
  modules: [
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-791237-60'
      }
    ]
  ]
}
