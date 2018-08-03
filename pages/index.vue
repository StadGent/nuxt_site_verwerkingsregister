<template>
  <section class="content-container">
    <div>
      <h1 class="title">
        Lijst verwerkingen burgers
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aliquam, corporis deserunt ea eius eligendi enim est incidunt ipsam nisi odit officia omnis quibusdam quisquam quo recusandae saepe sed! A adipisci consectetur consequatur delectus distinctio error eum explicabo facere hic, illo iusto nemo nesciunt nulla, omnis provident qui repellat! Esse impedit quod reprehenderit voluptatum?</p>
      <section class="verwerkingen">
        <div id="filter" class="filter-section" tabindex="-1">
          <div class="modal-actions">
            <button type="button" class="button close icon-cross modal-close modal__close">Sluiten</button>
          </div>
          <h2>Zoek verwerking</h2>
          <form action="#result" @submit.prevent="submitFilter">
            <div class="form-item">
              <label for="name">Naam <span class="label-optional">(Optioneel)</span></label>
              <input id="name" v-model="filter.name" type="text" name="name">
            </div>

            <checkbox_with_filter :items="processors"
                                  :legend="'Verwerkende dienst'"
                                  :name="'processor[]'"
                                  v-model="filter['processor[]']"/>

            <div class="form-item">
              <label for="datatypes">Welke gegevens <span class="label-optional">(Optioneel)</span></label>
              <input id="datatypes" :value="$route.query.datatypes" type="text" name="datatypes">
            </div>
            <div class="form-item">
              <label for="receiver">Ontvanger <span class="label-optional">(Optioneel)</span></label>
              <input id="receiver" :value="$route.query.receiver" type="text" name="receiver" placeholder="vb. OCMW">
            </div>
            <button type="submit" class="button button-primary">Zoek</button>
          </form>
          <h2>Verfijn resultaten</h2>
          <h3>Categorie</h3>
          <h3>Rechtsgrond</h3>
        </div>
        <div id="result" class="result-section">
          <selectedfilters :allowed-filters="allowedFilters"/>
          <button type="button"
                  class="button button-primary icon-filter result__show-filters modal-trigger"
                  aria-expanded="false"
                  aria-controls="filter"
                  @click="showFilters">Toon filters</button>
          <h2 :class="{'visually-hidden': selectedFilters.length === 0}">We vonden {{ total }} {{ total === 1 ? 'resultaat' : 'resultaten' }}</h2>
          <ul class="grid-1">
            <teaser v-for="(item, index) in paginatedItems"
                    :key="item.id"
                    :item="item"
                    :index="index"/>
            <pagination
              :total="totalPages"
              :active="currentPage"/>
          </ul>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import teaser from "~/components/molecules/teaser"
import pagination from "~/components/molecules/pagination"
import selectedfilters from "~/components/molecules/selectedfilters"
import checkbox_with_filter from "~/components/molecules/checkbox-with-filter"

const Modal = require("~/assets/js/modal.functions-min")

export default {
  head() {
    return {
      title: "verwerkingsregister"
    }
  },
  meta: {},
  components: { teaser, pagination, selectedfilters, checkbox_with_filter },
  watchQuery: ["page"].concat(this.allowedFilters),
  // Key needed to enable watchQuery and update form values
  key: to => to.fullPath,
  async fetch({ store }) {
    // Only fetch items once
    if (store.state.items.length === 0) {
      await store.dispatch("GET_ITEMS")
    }
  },
  data() {
    return {
      itemsPerPage: 10,
      allowedFilters: [
        "name",
        "service",
        "datatypes",
        "receiver",
        "processor[]"
      ],
      filter: {
        name: this.$route.query.name,
        service: this.$route.query.service,
        datatypes: this.$route.query.datatypes,
        receiver: this.$route.query.receiver,
        "processor[]": this.parseQueryArray("processor[]") || undefined
      }
    }
  },
  computed: {
    processors() {
      return this.$store.state.items
        .reduce((result, item) => {
          if (
            item.processor &&
            item.processor.value &&
            !result.includes(item.processor.value)
          ) {
            result.push(item.processor.value)
          }
          return result
        }, [])
        .sort((a, b) => {
          // omit non-word characters
          a = a.replace(/\W/g, "").toUpperCase()
          b = b.replace(/\W/g, "").toUpperCase()

          if (a > b) {
            return 1
          }
          if (a < b) {
            return -1
          }
          return 0
        })
    },
    items() {
      return this.$store.state.items || []
    },
    filteredItems() {
      return this.items
        .filter(item => {
          /* Check each filter and
          ** return true if all checks are valid
          */

          // name
          if (
            this.$route.query.name &&
            item.name.value
              .toUpperCase()
              .indexOf(this.$route.query.name.toUpperCase()) === -1
          ) {
            return false
          }

          // processor
          // todo compare uppercase
          // todo check invalid querystring values
          if (
            this.$route.query["processor[]"] &&
            this.$route.query["processor[]"].length > 0 &&
            !this.$route.query["processor[]"].includes(item.processor.value)
          ) {
            return false
          }
          return true
        })
        .sort((a, b) => {
          // omit non-word characters
          a = a.name.value.replace(/\W/g, "").toUpperCase()
          b = b.name.value.replace(/\W/g, "").toUpperCase()

          if (a > b) {
            return 1
          }
          if (a < b) {
            return -1
          }
          return 0
        })
    },
    total() {
      return this.filteredItems.length
    },
    totalPages() {
      return Math.ceil(this.total / this.itemsPerPage)
    },
    paginatedItems() {
      const index = this.currentPage * this.itemsPerPage - this.itemsPerPage
      return this.filteredItems.slice(index, index + this.itemsPerPage)
    },
    currentPage() {
      const queryPage = this.$route.query.page || 1
      if (queryPage <= 0 || isNaN(queryPage)) {
        return 1
      }
      if (queryPage > this.totalPages) {
        return this.totalPages
      }
      return +queryPage
    },
    selectedFilters() {
      return Object.keys(this.$route.query).reduce((result, key) => {
        if (this.allowedFilters.includes(key) && this.$route.query[key]) {
          result.push({
            key: key,
            value: this.$route.query[key]
          })
        }
        return result
      }, [])
    }
  },
  mounted() {
    new Modal(document.querySelector("#filter"))
  },
  methods: {
    /**
     * Parse a single query value to type Array.
     *
     * @param {String} key
     * @returns {Array|null}
     */
    parseQueryArray(key) {
      if (!this.$route.query[key]) {
        return null
      }

      return Array.isArray(this.$route.query[key])
        ? this.$route.query[key]
        : [this.$route.query[key]]
    },
    /**
     * Push selected filters to the query.
     */
    submitFilter() {
      /*
      Nuxt bug.
      URL won't update if an array in the query changes.
      Altering the route query first solves this.
       */
      this.$route.query.check++

      this.$router.push({
        path: `${this.$route.path}#result`,
        // Override existing query, including pagination
        query: this.filter
      })
    },
    showFilters() {}
  }
}
</script>

<style>
</style>
