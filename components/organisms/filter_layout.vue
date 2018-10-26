<template>
  <div class="sidebar-layout filter">
    <section id="filter"
             :aria-hidden="`${!filterHidden}`"
             :class="`filter-section sidebar modal ${modalOpen ? 'visible' : ''}`"
             tabindex="-1">
      <div class="modal-header">
        <button type="button"
                class="button close icon-cross modal-close"
                @click="closeModal">Sluiten</button>
      </div>
      <div class="modal-content">
        <h2>Zoek verwerking</h2>
        <form action="#result" @submit.prevent="submitFilter">
          <div class="form-item">
            <label for="name">Naam <span class="label-optional">(Optioneel)</span></label>
            <input id="name" v-model="filter.name" type="text" name="name">
          </div>
          <checkbox_with_filter v-if="processors.length"
                                :id="'services'"
                                :items="processors"
                                :legend="'Verwerkende dienst'"
                                :selected_legend="'dienst(en)'"
                                :name="'processor[]'"
                                v-model="filter['processor[]']"/>
          <checkbox_with_filter v-if="personalData.length"
                                :id="'data'"
                                :items="personalData"
                                :legend="'Welke gegevens?'"
                                :selected_legend="'gegeven(s)'"
                                :name="'personalData[]'"
                                v-model="filter['personalData[]']"/>
          <checkbox_with_filter v-if="grantees.length"
                                :id="'recipient'"
                                :items="grantees"
                                :legend="'Ontvanger'"
                                :selected_legend="'ontvanger(s)'"
                                :name="'grantees[]'"
                                v-model="filter['grantees[]']"/>
          <checkbox_with_filter v-if="types.length"
                                :id="'category'"
                                :items="types"
                                :legend="'Categorie'"
                                :selected_legend="'categorie(ën)'"
                                :name="'types[]'"
                                v-model="filter['types[]']"/>

          <fieldset v-if="formalFrameworks.length" class="form-item">
            <legend>Rechtmatigheid</legend>
            <div v-for="(formalFramework, index) in formalFrameworks" :key="index" class="checkbox" >
              <input :id="`formalFrameworks-chk-${index}`"
                     :value="formalFramework"
                     :name="'formalFrameworks[]'"
                     v-model="filter['formalFrameworks[]']"
                     type="checkbox"
                     class="checkbox">
              <label :for="`formalFrameworks-chk-${index}`">{{ formalFramework }}</label>
            </div>
          </fieldset>
          <button type="submit" class="button button-primary filter__submit" @click="closeModal">Zoek</button>
        </form>
      </div>
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
</template>

<script>
import teaser from "~/components/molecules/teaser"
import pagination from "~/components/molecules/pagination"
import selectedfilters from "~/components/molecules/selectedfilters"
import checkbox_with_filter from "~/components/molecules/checkbox-with-filter"
import introductietekst from "~/components/introductietekst"

const sortFunction = (a, b) => {
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
}

export default {
  components: {
    teaser,
    pagination,
    selectedfilters,
    checkbox_with_filter,
    introductietekst
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      itemsPerPage: 10,
      allowedFilters: [
        "name",
        "grantees[]",
        "personalData[]",
        "types[]",
        "formalFrameworks[]",
        "processor[]"
      ],
      filter: {
        name: this.$route.query.name,
        "personalData[]": this.parseQueryArray("personalData[]") || [],
        "grantees[]": this.parseQueryArray("grantees[]") || [],
        "types[]": this.parseQueryArray("types[]") || [],
        "formalFrameworks[]": this.parseQueryArray("formalFrameworks[]") || [],
        "processor[]": this.parseQueryArray("processor[]") || []
      },
      filterHidden: false,
      modalOpen: false
    }
  },
  computed: {
    processors() {
      return this.items
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
        .sort(sortFunction)
    },
    personalData() {
      return this.items
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
        .sort(sortFunction)
    },
    grantees() {
      return this.items
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
        .sort(sortFunction)
    },
    types() {
      return this.items
        .reduce((result, item) => {
          if (
            item.type &&
            item.type.value &&
            !result.includes(item.type.value)
          ) {
            result.push(item.type.value)
          }
          return result
        }, [])
        .sort(sortFunction)
    },
    formalFrameworks() {
      return this.items
        .reduce((result, item) => {
          if (
            item.formal_framework &&
            item.formal_framework.value &&
            !result.includes(item.formal_framework.value)
          ) {
            result.push(item.formal_framework.value)
          }
          return result
        }, [])
        .sort(sortFunction)
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

      const types = this.parseQueryArray("types[]")
      const typesRegex = types ? new RegExp(types.join("|"), "i") : null

      const formalFrameworks = this.parseQueryArray("formalFrameworks[]")
      const formalFrameworksRegex = formalFrameworks
        ? new RegExp(formalFrameworks.join("|"), "i")
        : null

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

          // types
          if (types && types.length > 0 && !typesRegex.test(item.type.value)) {
            return false
          }

          // formalFrameworks
          if (
            formalFrameworks &&
            formalFrameworks.length > 0 &&
            !formalFrameworksRegex.test(item.formal_framework.value)
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
        if (
          this.allowedFilters.includes(key) &&
          this.$route.query[key] &&
          this.$route.query[key].length > 0
        ) {
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
