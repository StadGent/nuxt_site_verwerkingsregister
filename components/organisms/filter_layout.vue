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
          <checkbox-with-filter v-if="personalData.length"
                                :id="'data'"
                                v-model="filter['personalData[]']"
                                :items="personalData"
                                :legend="'Welke gegevens?'"
                                :selected-legend="'gegeven(s)'"
                                :name="'personalData[]'" />
          <checkbox-with-filter v-if="grantees.length"
                                :id="'recipient'"
                                v-model="filter['grantees[]']"
                                :items="grantees"
                                :legend="'Ontvanger'"
                                :selected-legend="'ontvanger(s)'"
                                :name="'grantees[]'" />
          <checkbox-with-filter v-if="types.length"
                                :id="'category'"
                                v-model="filter['types[]']"
                                :items="types"
                                :legend="'Categorie'"
                                :selected-legend="'categorie(ën)'"
                                :name="'types[]'" />
          <fieldset v-if="formalFrameworks.length" class="form-item">
            <legend>Rechtmatigheid</legend>
            <div class="form-item">
              <div v-for="(formalFramework, index) in formalFrameworks" :key="index" class="checkbox">
                <input :id="`formalFrameworks-chk-${index}`"
                       v-model="filter['formalFrameworks[]']"
                       :value="formalFramework"
                       :name="'formalFrameworks[]'"
                       type="checkbox"
                       class="checkbox">
                <label :for="`formalFrameworks-chk-${index}`">{{ formalFramework }}</label>
              </div>
            </div>
          </fieldset>
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
          Toon filters
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
import checkboxWithFilter from '~/components/molecules/checkbox-with-filter'

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
    checkboxWithFilter
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
        'formalFrameworks[]'
      ],
      filter: {
        name: this.$route.query.name,
        'personalData[]': this.parseQueryArray('personalData[]') || [],
        'grantees[]': this.parseQueryArray('grantees[]') || [],
        'types[]': this.parseQueryArray('types[]') || [],
        'formalFrameworks[]': this.parseQueryArray('formalFrameworks[]') || []
      },
      filterHidden: false,
      modalOpen: false
    }
  },
  computed: {
    personalData () {
      return this.items
        .reduce((result, item) => {
          if (item.personalData && item.personalData.value) {
            for (let i = item.personalData.value.length; i--;) {
              if (!result.includes(item.personalData.value[i])) {
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
