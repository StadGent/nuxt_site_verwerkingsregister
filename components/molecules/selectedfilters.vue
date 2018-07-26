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
  methods: {
    clearFilter(filter) {
      let query = Object.assign({}, this.$route.query)
      delete query[filter.key]
      delete query.page

      this.$router.push({
        query: query
      })
    }
  }
}
</script>
