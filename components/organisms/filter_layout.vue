<template>
  <div class="sidebar-layout filter">
    <section id="filter"
             :aria-hidden="`${!filterHidden}`"
             :class="`filter-section modal--fixed-height sidebar modal ${modalOpen ? 'visible' : ''}`"
             tabindex="-1">
      <form action="#result" class="modal-inner" @submit.prevent="submitFilter">
        <div class="modal-header">
          <button type="button"
                  class="button close icon-cross modal-close"
                  @click="closeModal">
            Sluiten
          </button>
        </div>
        <div class="modal-content">
          <h2>Zoek verwerking</h2>
          <div class="form-item">
            <label for="name">Naam <span class="label-optional">(Optioneel)</span></label>
            <input id="name" v-model="filter.name" type="text" name="name">
          </div>
          <checkboxes-dynamic v-if="processors.length"
                              id="services"
                              v-model="filter['processor[]']"
                              :items="processors"
                              legend="Verwerkende dienst"
                              name="processor[]" />
          <checkboxes-dynamic v-if="personalData.length"
                              id="data"
                              v-model="filter['personalData[]']"
                              :items="personalData"
                              legend="Welke gegevens?"
                              name="personalData[]" />
          <checkboxes-dynamic v-if="grantees.length"
                              id="recipient"
                              v-model="filter['grantees[]']"
                              :items="grantees"
                              legend="Ontvanger"
                              name="grantees[]" />
          <checkboxes-dynamic v-if="types.length"
                              id="category"
                              v-model="filter['types[]']"
                              :items="types"
                              legend="Categorie"
                              name="types[]" />
          <checkboxes-dynamic v-if="formalFrameworks.length"
                              id="formalFrameworks"
                              v-model="filter['formalFrameworks[]']"
                              :items="formalFrameworks"
                              legend="Rechtmatigheid"
                              name="formalFrameworks[]" />
        </div>
        <div class="modal-actions">
          <button type="submit" class="button button-primary filter__submit modal-close" @click="closeModal">
            Zoek
          </button>
        </div>
      </form>
      <div class="modal-overlay modal-close" data-target="filter" tabindex="-1" />
    </section>
    <section id="result" class="content result-section">
      <selectedfilters :allowed-filters="allowedFilters" />
      <div class="filter__result-count">
        <h2 :class="{'visually-hidden': selectedFilters.length === 0}">
          We vonden {{ total }} {{ total === 1 ? 'resultaat' : 'resultaten' }}
        </h2>
        <button type="button"
                class="button button-secondary icon-filter result__show-filters modal-trigger"
                aria-expanded="false"
                aria-controls="filter"
                @click="openModal">
          Filters
        </button>
      </div>
      <ul class="filter__results">
        <teaser v-for="(item, index) in paginatedItems"
                :key="index"
                :item="item"
                :index="index" />
      </ul>
      <pagination
        :total="totalPages"
        :active="currentPage" />
    </section>
  </div>
</template>

<script>
import teaser from '~/components/molecules/teaser'
import pagination from '~/components/molecules/pagination'
import selectedfilters from '~/components/molecules/selectedfilters'
import checkboxesDynamic from '~/components/molecules/checkboxes-dynamic'
import Modal from '@digipolis-gent/modal'

const sortFunction = (a, b) => {
  // omit non-word characters
  a = a.replace(/\W/g, '').toUpperCase()
  b = b.replace(/\W/g, '').toUpperCase()

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
    checkboxesDynamic
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      itemsPerPage: 10,
      allowedFilters: [
        'name',
        'grantees[]',
        'personalData[]',
        'types[]',
        'formalFrameworks[]',
        'processor[]'
      ],
      filter: {
        name: this.$route.query.name,
        'personalData[]': this.parseQueryArray('personalData[]') || [],
        'grantees[]': this.parseQueryArray('grantees[]') || [],
        'types[]': this.parseQueryArray('types[]') || [],
        'formalFrameworks[]': this.parseQueryArray('formalFrameworks[]') || [],
        'processor[]': this.parseQueryArray('processor[]') || []
      },
      filterHidden: false,
      modalOpen: false
    }
  },
  computed: {
    processors () {
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
    personalData () {
      return this.items
        .reduce((result, item) => {
          if (item.personalData && item.personalData.value) {
            for (let i = item.personalData.value.length; i--;) {
              if (!result.includes(item.personalData.value[i]) && item.personalData.value[i]) {
                result.push(item.personalData.value[i])
              }
            }
          }
          return result
        }, [])
        .sort(sortFunction)
    },
    grantees () {
      return this.items
        .reduce((result, item) => {
          if (item.grantees && item.grantees.value) {
            for (let i = item.grantees.value.length; i--;) {
              if (!result.includes(item.grantees.value[i])) {
                result.push(item.grantees.value[i])
              }
            }
          }
          return result
        }, [])
        .sort(sortFunction)
    },
    types () {
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
    formalFrameworks () {
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
    filteredItems () {
      const processors = this.parseQueryArray('processor[]')
      const processorRegex = processors
        ? new RegExp(processors.join('|'), 'i')
        : null

      const data = this.parseQueryArray('personalData[]')
      const dataRegex = data ? new RegExp(data.join('|'), 'i') : null

      const grantees = this.parseQueryArray('grantees[]')
      const granteeRegex = grantees ? new RegExp(grantees.join('|'), 'i') : null

      const types = this.parseQueryArray('types[]')
      const typesRegex = types ? new RegExp(types.join('|'), 'i') : null

      const formalFrameworks = this.parseQueryArray('formalFrameworks[]')
      const formalFrameworksRegex = formalFrameworks
        ? new RegExp(formalFrameworks.join('|'), 'i')
        : null

      return this.items
        .filter((item) => {
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
            const nameA = a.name.value.replace(/\W/g, '').toUpperCase()
            const nameB = b.name.value.replace(/\W/g, '').toUpperCase()

            if (nameA > nameB) {
              return 1
            }
            if (nameA < nameB) {
              return -1
            }

            // sort by processor
            // omit non-word characters
            const processorA = a.processor.value
              .replace(/\W/g, '')
              .toUpperCase()
            const processorB = b.processor.value
              .replace(/\W/g, '')
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
    total () {
      return this.filteredItems.length
    },
    totalPages () {
      return Math.ceil(this.total / this.itemsPerPage)
    },
    paginatedItems () {
      const index = this.currentPage * this.itemsPerPage - this.itemsPerPage
      return this.filteredItems.slice(index, index + this.itemsPerPage)
    },
    currentPage () {
      const queryPage = this.$route.query.page || 1
      if (queryPage <= 0 || isNaN(queryPage)) {
        return 1
      }
      if (queryPage > this.totalPages) {
        return this.totalPages
      }
      return +queryPage
    },
    selectedFilters () {
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
  mounted () {
    this.filterHidden = window.innerWidth > 768

    // init gent_styleguide modal
    const filter = document.querySelector('#filter')
    // eslint-disable-next-line no-new
    new Modal(filter, {
      resizeEvent: (open, close) => {
        if (window.innerWidth > 960) {
          close()
          filter.setAttribute('aria-hidden', 'false')
        } else if (!filter.classList.contains('visible')) {
          filter.setAttribute('aria-hidden', 'true')
        }
      },
      changeHash: false
    })

    const modals = document.querySelectorAll('.modal:not(#filter)')
    for (let i = modals.length; i--;) {
      // eslint-disable-next-line no-new
      new Modal(modals[i], { changeHash: false })
    }

    const Accordion = require('gent_styleguide/build/styleguide/js/accordion.functions-min')
    const accordions = document.querySelectorAll('.checkbox-accordion')
    for (let i = accordions.length; i--;) {
      // eslint-disable-next-line no-new
      new Accordion(accordions[i])
    }

    const CheckboxFilterDynamic = require('gent_styleguide/build/styleguide/js/checkbox_dynamic.functions')
    const checkboxFilters = document.querySelectorAll('.checkbox-filter-dynamic')
    for (let i = checkboxFilters.length; i--;) {
      // eslint-disable-next-line no-new
      new CheckboxFilterDynamic(checkboxFilters[i], { makeTags: false })
    }
  },
  methods: {
    /**
     * Parse a single query value to type Array.
     *
     * @param {String} key
     * @returns {Array|null}
     */
    parseQueryArray (key) {
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
    submitFilter () {
      this.$router.push({
        path: `${this.$route.path}#result`,
        // Override existing query, including pagination
        query: this.filter
      })
    },
    openModal () {
      this.filterHidden = true
      this.modalOpen = true
    },
    closeModal () {
      this.filterHidden = false
      this.modalOpen = false
    }
  }
}
</script>
