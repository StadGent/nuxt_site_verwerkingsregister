import Vuex from "vuex"
import axios from "axios"

export default () => {
  return new Vuex.Store({
    state: {
      breadcrumbs: [],
      items: []
    },
    mutations: {
      setBreadcrumbs(state, data) {
        state.breadcrumbs = data
      },
      SET_ITEMS(state, data) {
        state.items = data
      }
    },
    actions: {
      async GET_ITEMS({ commit }) {
        let items = await axios.get(
          "https://stad.gent/sparql?default-graph-uri=&query=PREFIX+schema:+<http://schema.org/>SELECT+?event+?url+?name+?contributor+?free+FROM+<http://stad.gent/gentse-feesten-2018/>+WHERE+{\t?event+a+schema:Event;+schema:name+?name;+schema:description+?description;+schema:url+?url;+schema:isAccessibleForFree+?free;+schema:contributor+?c.++\t?c+schema:name+?contributor}"
        )

        try {
          items = items.data.results.bindings
          // get the ID from the event value
          items.map(item => {
            const splitValues = item.event.value.split("/")
            item.id = splitValues[splitValues.length - 1]
            return item
          })
        } catch (error) {
          // todo show error
          items = []
        }

        commit("SET_ITEMS", items)
      }
    }
  })
}
