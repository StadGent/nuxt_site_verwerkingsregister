# verwerkingsregister

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

Before running the dev environment: disable _svg-icons.scss in assets/sass/main.scss.  
Be sure to include it again in the production build!

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Deploy

Set a environment variable "PROD_ENV" to "test", "qa" or "production".  
In absence of "PROD_ENV=production", the SPARQL endpoint will be qa.stad.gent. 

## Customization

You can change the introduction text by updating the introductietekst.vue component 
located in the root of the components folder.
