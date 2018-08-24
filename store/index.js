import Vuex from "vuex"
import axios from "axios"
import { cacheAdapterEnhancer } from "axios-extensions"
import LRUCache from "lru-cache"

const SIX_HOURS = 1000 * 60 * 60 * 6
const LIMIT = 1000

// Make axios enable caching
const http = axios.create({
  baseURL: "/",
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    defaultCache: new LRUCache({ maxAge: SIX_HOURS })
  })
})

let URL = "https://qa.stad.gent/"
if (process.env.DEPLOY_ENV === "production") {
  URL = "https://stad.gent/"
}

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

const DETAIL_QUERY = (id, URL) => {
  return `PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
  PREFIX dcterms: <http://purl.org/dc/terms/> 
  PREFIX gdv: <http://stad.gent/data/ns/data-processing/> 
  SELECT  
  ?id  
  ?description 
  ?processor  
  ?type 
  ?name 
  ?personalDataDescription 
  ?sensitivePersonalDataDescription 
  (group_concat(distinct ?personalData;separator=',') as ?personalData) 
  (group_concat(distinct ?sensitivePersonalData;separator=',') as ?sensitivePersonalData) 
  ?formal_framework 
  ?formal_framework_clarification 
  (group_concat(distinct ?grantee;separator=',') as ?grantees) 
  ?storagePeriod 
  FROM <http://stad.gent/data-processes/> 
  WHERE { 
    ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>; 
    dcterms:identifier ?id; 
    dcterms:description ?description; 
    <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework; 
    gdv:formalFrameworkClarification ?formal_framework_clarification . 
    ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor; 
    dcterms:type/skos:prefLabel ?type; 
    dcterms:title ?name;  
    <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee; 
    dcterms:temporal/dcterms:title ?storagePeriod 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:description ?personalDataDescription } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:description ?sensitivePersonalDataDescription } 
    FILTER (?verwerking=<${URL}id/data-process/${id}>) 
  }`
}

export default () => {
  return new Vuex.Store({
    state: {
      breadcrumbs: [],
      items: [],
      details: {}
    },
    mutations: {
      SET_BREADCRUMBS(state, data) {
        state.breadcrumbs = data
      },
      SET_ITEMS(state, data) {
        state.items = data
      },
      SET_DETAIL(state, data) {
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
      async GET_ITEMS({ commit }) {
        let count, result
        try {
          count = await http.get(
            URL + "sparql?query=" + encodeURIComponent(COUNT_QUERY)
          )
        } catch (error) {
          throw error
        }
        try {
          count = count.data.results.bindings[0].count.value
          let promises = []
          for (let i = 0; i < count / LIMIT; i++) {
            promises.push(
              new Promise((resolve, reject) => {
                http
                  .get(
                    URL +
                      "sparql?query=" +
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
          result = await Promise.all(promises)
        } catch (error) {
          throw error
        }
        try {
          let verwerkingen = [].concat.apply([], result)
          commit("SET_ITEMS", verwerkingen)
        } catch (error) {
          throw { statusCode: 500, message: "Invalid JSON response" }
        }
      },
      /**
       * Fetch item details from the sparql endpoint.
       *
       * @param {Function} commit
       * @returns {Promise.<void>}
       * @constructor
       */
      async GET_DETAIL({ commit }, id) {
        let result
        try {
          result = await http.get(
            URL + "sparql/?query=" + encodeURIComponent(DETAIL_QUERY(id, URL))
          )
        } catch (error) {
          // connection error
          throw error
        }

        if (
          !result ||
          !result.data ||
          !result.data.results ||
          !result.data.results.bindings ||
          result.data.results.bindings.length === 0
        ) {
          // no results found
          throw { statusCode: 404, message: "Post not found" }
        }

        try {
          result = result.data.results.bindings[0]
          if (!result.cached) {
            result.grantees.value =
              result.grantees.value !== ""
                ? result.grantees.value.split(",")
                : []
            result.personalData.value =
              result.personalData.value !== ""
                ? result.personalData.value.split(",")
                : []
            result.sensitivePersonalData.value =
              result.sensitivePersonalData.value !== ""
                ? result.sensitivePersonalData.value.split(",")
                : []
            result.cached = true
          }

          commit("SET_DETAIL", result)
        } catch (error) {
          // result processing failed
          throw { statusCode: 500, message: "Invalid JSON response" }
        }
      }
    }
  })
}
