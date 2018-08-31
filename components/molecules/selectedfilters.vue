<template>
  <div v-if="selectedFilters.length > 0" class="selected-filters">
    <h2>U koos voor:</h2>
    <template v-for="filter in selectedFilters">
      <span :key="filter.key" class="tag filter">
        {{ filter.value }}
        <button @click="clearFilter(filter)"><span class="visually-hidden">Verwijder deze filter</span></button>
      </span>
    </template>
    <nuxt-link :to="$route.path">Wis alle filters</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    allowedFilters: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * Parse the query to extract all selected filters.
     *
     * @returns {Array}
     */
    selectedFilters() {
      return Object.keys(this.$route.query).reduce((result, key) => {
        if (!this.allowedFilters.includes(key) || !this.$route.query[key]) {
          return result
        }

        // Get checkbox query values
        if (Array.isArray(this.$route.query[key])) {
          for (let i = this.$route.query[key].length; i--; ) {
            result.push({
              key: `${key}-${i}`,
              value: this.$route.query[key][i],
              filterKey: key
            })
          }
          return result
        }

        // Get single value
        result.push({
          key: key,
          value: this.$route.query[key]
        })

        return result
      }, [])
    }
  },
  methods: {
    /**
     * Remove a single filter from the query.
     *
     * @param {Object} filter
     */
    clearFilter(filter) {
      let query = Object.assign({}, this.$route.query)

      // Delete single query value
      if (query[filter.key]) {
        delete query[filter.key]
      }

      // Delete checkbox query value
      else if (filter.filterKey) {
        const index = query[filter.filterKey].indexOf(filter.value)
        if (index !== -1) {
          query[filter.filterKey].splice(index, 1)
        }
      }

      // Reset paging
      delete query.page

      // Force querystring to renew (bug)
      query.check = ++query.check || 0

      this.$router.push({
        path: `${this.$route.path}#result`,
        query: query
      })
    }
  }
}
</script>
