import Vuex from "vuex"
import axios from "axios"

const SPARQL_QUERY =
  "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>" +
  "PREFIX schema: <http://schema.org/>" +
  "PREFIX dcterms: <http://purl.org/dc/terms/>" +
  "PREFIX gdv: <http://stad.gent/data/ns/data-processing/>" +
  "SELECT" +
  "  ?id" +
  "  ?processor" +
  "  ?type" +
  "  ?name" +
  "  (concat(group_concat(distinct ?personalData;separator=','),group_concat(distinct ?sensitivePersonalData;separator=',')) as ?personalData)" +
  "  ?formal_framework" +
  "  (concat(group_concat(distinct ?grantee;separator=',')) as ?grantees)" +
  "FROM <http://stad.gent/data-processes/>" +
  "FROM <http://stad.gent/agents/>" +
  "WHERE {\n" +
  "  ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>;\n" +
  "  dcterms:identifier ?id;\t\n" +
  "  <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond> ?formal_framework .\n" +
  "  ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor;\n" +
  "  dcterms:type/skos:prefLabel ?type;\n" +
  "  dcterms:title ?name; \n" +
  "  <http://stad.gent/data/ns/data-processing/grantee> ?grantee;\t\n" +
  "  <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData .\n" +
  "  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData }\n" +
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
        try {
          let verwerkingen = await axios.get(
            "https://qa.stad.gent/sparql?query=" +
              encodeURIComponent(SPARQL_QUERY)
          )

          verwerkingen = verwerkingen.data.results.bindings
          verwerkingen.map(verwerking => {
            verwerking.grantees.value = verwerking.grantees.value.split(",")
            verwerking.personalData.value = verwerking.personalData.value.split(
              ","
            )
          })

          commit("SET_ITEMS", verwerkingen)
        } catch (error) {
          // todo show error
        }
      }
    }
  })
}
