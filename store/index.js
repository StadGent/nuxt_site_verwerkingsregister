import Vuex from "vuex"
import axios from "axios"
import { cacheAdapterEnhancer } from "axios-extensions"
import LRUCache from "lru-cache"

const SIX_HOURS = 1000 * 60 * 60 * 6
const LIMIT = 1000

// Make axios enable caching
const http = axios.create({
  baseURL: "/",
  headers: { "Cache-Control": "no-cache" },
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    defaultCache: new LRUCache({ maxAge: SIX_HOURS })
  })
})

const COUNT_QUERY =
  "SELECT " +
  "(count(?verwerking) as ?count)" +
  "FROM <http://stad.gent/data-processes/>" +
  "WHERE { ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit> }"

const SPARQL_QUERY =
  "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>" +
  "PREFIX dcterms: <http://purl.org/dc/terms/>" +
  "PREFIX gdv: <http://stad.gent/data/ns/data-processing/>" +
  "SELECT" +
  "  ?id" +
  "  ?processor" +
  "  ?type" +
  "  ?name" +
  "  (concat(group_concat(distinct ?personalData;separator=','),group_concat(distinct ?sensitivePersonalData;separator=',')) as ?personalData)" +
  "  ?formal_framework" +
  "  (group_concat(distinct ?grantee;separator=',') as ?grantees)" +
  "FROM <http://stad.gent/data-processes/>" +
  "WHERE {" +
  "  ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>;" +
  "  dcterms:identifier ?id;" +
  "  <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework ." +
  "  ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor;" +
  "  dcterms:type/skos:prefLabel ?type;" +
  "  dcterms:title ?name; " +
  "  <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee ." +
  "  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData }" +
  "  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData }" +
  "}" +
  "group by" +
  "?verwerking" +
  "?id" +
  "?formal_framework" +
  "?processor" +
  "?type" +
  "?name"

export default () => {
  return new Vuex.Store({
    state: {
      breadcrumbs: [],
      items: []
    },
    mutations: {
      SET_BREADCRUMBS(state, data) {
        state.breadcrumbs = data
      },
      SET_ITEMS(state, data) {
        state.items = data
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
      async GET_ITEMS({ commit }) {
        let url = "https://qa.stad.gent/sparql"
        if (process.env.DEPLOY_ENV === "production") {
          url = "https://stad.gent/sparql"
        }

        try {
          let count = await http.get(
            url + "?query=" + encodeURIComponent(COUNT_QUERY)
          )

          count = count.data.results.bindings[0].count.value

          let promises = []
          for (let i = 0; i < count / LIMIT; i++) {
            promises.push(
              new Promise((resolve, reject) => {
                http
                  .get(
                    url +
                      "?query=" +
                      encodeURIComponent(
                        SPARQL_QUERY +
                          " LIMIT " +
                          LIMIT +
                          " OFFSET " +
                          i * LIMIT
                      )
                  )
                  .then(result => {
                    result = result.data.results.bindings
                    console.log(result.cached, i)

                    // check for cached version
                    if (!result.cached) {
                      result.map(verwerking => {
                        verwerking.grantees.value = verwerking.grantees.value.split(
                          ","
                        )
                        verwerking.personalData.value = verwerking.personalData.value.split(
                          ","
                        )
                      })

                      // label data as cached
                      result.cached = true
                    }
                    resolve(result)
                  })
                  .catch(error => {
                    reject(error)
                  })
              })
            )
          }

          let result = await Promise.all(promises)
          let verwerkingen = [].concat.apply([], result)
          console.log(verwerkingen.length)

          commit("SET_ITEMS", verwerkingen)
        } catch (error) {
          console.error(error)
          // todo show error
        }
      }
    }
  })
}
