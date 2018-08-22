<template>
  <section class="content-container">
    <h1 class="title">
      Lijst verwerkingen burgers
    </h1>
    <introductietekst/>
    <div class="sidebar-layout filter">
      <section id="filter"
               :aria-hidden="`${!filterHidden}`"
               :class="`filter-section sidebar modal ${modalOpen ? 'visible' : ''}`"
               tabindex="-1">
        <div class="modal-actions">
          <button type="button"
                  class="button close icon-cross modal-close modal__close"
                  @click="closeModal">Sluiten</button>
        </div>
        <h2>Zoek verwerking</h2>
        <form action="#result" @submit.prevent="submitFilter">
          <div class="form-item">
            <label for="name">Naam <span class="label-optional">(Optioneel)</span></label>
            <input id="name" v-model="filter.name" type="text" name="name">
          </div>

          <checkbox_with_filter :items="processors"
                                :legend="'Verwerkende dienst'"
                                :selected_legend="'dienst(en)'"
                                :name="'processor[]'"
                                v-model="filter['processor[]']"/>
          <checkbox_with_filter :items="personalData"
                                :legend="'Welke gegevens?'"
                                :selected_legend="'gegeven(s)'"
                                :name="'personalData[]'"
                                v-model="filter['personalData[]']"/>
          <checkbox_with_filter :items="grantees"
                                :legend="'Ontvanger'"
                                :selected_legend="'ontvanger(s)'"
                                :name="'grantees[]'"
                                v-model="filter['grantees[]']"/>

          <button type="submit" class="button button-primary filter__submit" @click="closeModal">Zoek</button>
        </form>
        <h2>Verfijn resultaten</h2>
        <h3>Categorie</h3>
        <h3>Rechtmatigheid</h3>
      </section>
      <section id="result" class="content result-section">
        <selectedfilters :allowed-filters="allowedFilters"/>
        <button type="button"
                class="button button-primary icon-filter result__show-filters modal-trigger"
                aria-expanded="false"
                aria-controls="filter"
                @click="openModal">Toon filters</button>
        <h2 :class="{'visually-hidden': selectedFilters.length === 0}">We vonden {{ total }} {{ total === 1 ? 'resultaat' : 'resultaten' }}</h2>
        <ul class="filter__results">
          <teaser v-for="(item, index) in paginatedItems"
                  :key="index"
                  :item="item"
                  :index="index"/>
        </ul>
        <pagination
          :total="totalPages"
          :active="currentPage"/>
      </section>
    </div>
  </section>
</template>

<script>
import teaser from "~/components/molecules/teaser"
import pagination from "~/components/molecules/pagination"
import selectedfilters from "~/components/molecules/selectedfilters"
import checkbox_with_filter from "~/components/molecules/checkbox-with-filter"
import introductietekst from "~/components/introductietekst"

const Modal = require("~/node_modules/gent_styleguide/build/styleguide/js/modal.functions")
const CheckboxFilter = require("~/node_modules/gent_styleguide/build/styleguide/js/checkbox_filter.functions")

export default {
  head() {
    return {
      title: "verwerkingsregister"
    }
  },
  meta: {},
  components: {
    teaser,
    pagination,
    selectedfilters,
    checkbox_with_filter,
    introductietekst
  },
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
        "grantees[]",
        "personalData[]",
        "receiver",
        "processor[]"
      ],
      filter: {
        name: this.$route.query.name,
        "personalData[]": this.parseQueryArray("personalData[]") || undefined,
        "grantees[]": this.parseQueryArray("grantees[]") || undefined,
        receiver: this.$route.query.receiver,
        "processor[]": this.parseQueryArray("processor[]") || undefined
      },
      filterHidden: false,
      modalOpen: false
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
    personalData() {
      return this.$store.state.items
        .reduce((result, item) => {
          if (item.personalData && item.personalData.value) {
            for (let i = item.personalData.value.length; i--; ) {
              if (!result.includes(item.personalData.value[i])) {
                result.push(item.personalData.value[i])
              }
            }
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
    grantees() {
      return this.$store.state.items
        .reduce((result, item) => {
          if (item.grantees && item.grantees.value) {
            for (let i = item.grantees.value.length; i--; ) {
              if (!result.includes(item.grantees.value[i])) {
                result.push(item.grantees.value[i])
              }
            }
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
      const processors = this.parseQueryArray("processor[]")
      const processorRegex = processors
        ? new RegExp(processors.join("|"), "i")
        : null

      const data = this.parseQueryArray("personalData[]")
      const dataRegex = data ? new RegExp(data.join("|"), "i") : null

      const grantees = this.parseQueryArray("grantees[]")
      const granteeRegex = grantees ? new RegExp(grantees.join("|"), "i") : null

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
          if (
            processors &&
            processors.length > 0 &&
            !processorRegex.test(item.processor.value)
          ) {
            return false
          }

          // personalData
          if (
            data &&
            data.length > 0 &&
            !dataRegex.test(item.personalData.value)
          ) {
            return false
          }

          // grantees
          if (
            grantees &&
            grantees.length > 0 &&
            !granteeRegex.test(item.grantees.value)
          ) {
            return false
          }

          return true
        })
        .sort((a, b) => {
          try {
            // sort by name
            // omit non-word characters
            const nameA = a.name.value.replace(/\W/g, "").toUpperCase()
            const nameB = b.name.value.replace(/\W/g, "").toUpperCase()

            if (nameA > nameB) {
              return 1
            }
            if (nameA < nameB) {
              return -1
            }

            // sort by processor
            // omit non-word characters
            const processorA = a.processor.value
              .replace(/\W/g, "")
              .toUpperCase()
            const processorB = b.processor.value
              .replace(/\W/g, "")
              .toUpperCase()
            if (processorA > processorB) {
              return 1
            }
            if (processorA < processorB) {
              return -1
            }
          } catch (error) {
            return 0
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
    this.filterHidden = window.innerWidth > 768

    // init gent_styleguide modal
    const filter = document.querySelector("#filter")
    new Modal(filter, {
      resizeEvent: () => {
        if (window.innerWidth > 768) {
          filter.setAttribute("aria-hidden", "false")
        } else {
          filter.setAttribute("aria-hidden", "true")
        }
      }
    })

    // init gent_styleguide checkbox-with-filters
    const checkboxWithFilters = document.querySelectorAll(".checkbox-filter")
    for (let i = checkboxWithFilters.length; i--; ) {
      new CheckboxFilter(checkboxWithFilters[i], {
        makeTags: false
      })
    }
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
    openModal() {
      this.filterHidden = true
      this.modalOpen = true
    },
    closeModal() {
      document.body.style.overflow = null
      this.filterHidden = false
      this.modalOpen = false
    }
  }
}
</script>

<style>
.result-section {
  padding-top: 1.2rem;
}
</style>
