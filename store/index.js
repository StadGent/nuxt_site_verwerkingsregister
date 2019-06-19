import Vuex from 'vuex'
import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions'
import LRUCache from 'lru-cache'
// Todo: add distinct queries for employers and civilians.
import { COUNT, LIST, DETAIL } from '~/queries'

const SIX_HOURS = 1000 * 60 * 60 * 6
const LIMIT = 1000

// Make axios enable caching
const http = axios.create({
  baseURL: '/',
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    defaultCache: new LRUCache({ maxAge: SIX_HOURS })
  })
})

let URL = 'https://qa.stad.gent/'
if (process.env.DEPLOY_ENV === 'production') {
  URL = 'https://stad.gent/'
}

const processDetail = (result) => {
  return new Promise((resolve, reject) => {
    if (
      !result ||
      !result.data ||
      !result.data.results ||
      !result.data.results.bindings ||
      result.data.results.bindings.length === 0
    ) {
      // no results found
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ statusCode: 404, message: 'Post not found' })
    }

    try {
      result = result.data.results.bindings[0]
      if (!result.cached) {
        result.grantees.value =
          result.grantees.value !== '' ? result.grantees.value.split(',') : []
        result.personalData.value =
          result.personalData.value !== ''
            ? result.personalData.value.split(',')
            : []
        result.sensitivePersonalData.value =
          result.sensitivePersonalData.value !== ''
            ? result.sensitivePersonalData.value.split(',')
            : []
        result.cached = true
      }
      resolve(result)
    } catch (error) {
      // result processing failed
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ statusCode: 500, message: 'Invalid JSON response' })
    }
  })
}
const processList = (result) => {
  return new Promise((resolve) => {
    result = result.data.results.bindings

    // check for cached version
    if (!result.cached) {
      result.map((verwerking) => {
        verwerking.grantees.value =
          verwerking.grantees.value !== ''
            ? verwerking.grantees.value.split(',')
            : []
        verwerking.personalData.value =
          verwerking.personalData.value !== ''
            ? verwerking.personalData.value.split(',')
            : []
      })

      // label data as cached
      result.cached = true
    }
    resolve(result)
  })
}

export default () => {
  return new Vuex.Store({
    state: {
      breadcrumbs: [],
      items_civ: [],
      items_emp: [],
      details: {},
      home: '/'
    },
    mutations: {
      SET_BREADCRUMBS (state, data) {
        state.breadcrumbs = data
      },
      SET_HOME_URL (state, data) {
        state.home = data
      },
      SET_ITEMS_CIV (state, data) {
        state.items_civ = data
      },
      SET_ITEMS_EMP (state, data) {
        state.items_emp = data
      },
      SET_DETAIL (state, data) {
        state.details[data.id.value] = data
      }
    },
    actions: {
      /**
       * Fetch the items from the sparql endpoint.
       *
       * @param {Function} commit
       * @returns {Promise.<void>}
       * @constructor
       */
      async GET_ITEMS_CIV ({ commit }) {
        let count, result
        try {
          count = await http.get(
            URL + 'sparql?query=' + encodeURIComponent(COUNT('burger'))
          )
        } catch (error) {
          throw error
        }
        try {
          count = count.data.results.bindings[0].count.value
          const promises = []
          for (let i = 0; i < count / LIMIT; i++) {
            promises.push(
              new Promise((resolve, reject) => {
                http
                  .get(
                    URL +
                      'sparql?query=' +
                      encodeURIComponent(
                        LIST('burger') +
                          ' LIMIT ' +
                          LIMIT +
                          ' OFFSET ' +
                          i * LIMIT
                      )
                  )
                  .then(processList)
                  .then((result) => {
                    resolve(result)
                  })
                  .catch((error) => {
                    reject(error)
                  })
              })
            )
          }
          result = await Promise.all(promises)
        } catch (error) {
          throw error
        }
        try {
          const verwerkingen = [].concat.apply([], result)
          commit('SET_ITEMS_CIV', verwerkingen)
        } catch (error) {
          // eslint-disable-next-line no-throw-literal
          throw { statusCode: 500, message: 'Invalid JSON response' }
        }
      },
      /**
       * Fetch item details from the sparql endpoint.
       *
       * @param {Function} commit
       * @returns {Promise.<void>}
       * @constructor
       */
      async GET_DETAIL_CIV ({ commit }, id) {
        let result
        try {
          result = await http.get(
            URL + 'sparql/?query=' + encodeURIComponent(DETAIL(id, URL))
          )
        } catch (error) {
          // connection error
          throw error
        }
        try {
          result = await processDetail(result)
        } catch (error) {
          // data processing error
          throw error
        }
        commit('SET_DETAIL', result)
      },
      /**
       * Fetch the items from the sparql endpoint.
       *
       * @param {Function} commit
       * @returns {Promise.<void>}
       * @constructor
       */
      async GET_ITEMS_EMP ({ commit }) {
        let count, result
        try {
          count = await http.get(
            URL + 'sparql?query=' + encodeURIComponent(COUNT('werknemer stad'))
          )
        } catch (error) {
          throw error
        }
        try {
          count = count.data.results.bindings[0].count.value
          const promises = []
          for (let i = 0; i < count / LIMIT; i++) {
            promises.push(
              new Promise((resolve, reject) => {
                http
                  .get(
                    URL +
                      'sparql?query=' +
                      encodeURIComponent(
                        LIST('werknemer stad') +
                          ' LIMIT ' +
                          LIMIT +
                          ' OFFSET ' +
                          i * LIMIT
                      )
                  )
                  .then(processList)
                  .then((result) => {
                    resolve(result)
                  })
                  .catch((error) => {
                    reject(error)
                  })
              })
            )
          }
          result = await Promise.all(promises)
        } catch (error) {
          throw error
        }
        try {
          const verwerkingen = [].concat.apply([], result)
          commit('SET_ITEMS_EMP', verwerkingen)
        } catch (error) {
          // eslint-disable-next-line no-throw-literal
          throw { statusCode: 500, message: 'Invalid JSON response' }
        }
      },
      /**
       * Fetch item details from the sparql endpoint.
       *
       * @param {Function} commit
       * @returns {Promise.<void>}
       * @constructor
       */
      async GET_DETAIL_EMP ({ commit }, id) {
        let result
        try {
          result = await http.get(
            URL + 'sparql/?query=' + encodeURIComponent(DETAIL(id, URL))
          )
        } catch (error) {
          // connection error
          throw error
        }
        try {
          result = await processDetail(result)
        } catch (error) {
          // data processing error
          throw error
        }
        commit('SET_DETAIL', result)
      }
    }
  })
}
