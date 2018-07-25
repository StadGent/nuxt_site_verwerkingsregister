<template>
  <section class="content-container">
    <div>
      <h1 class="title">
        Lijst verwerkingen burgers
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aliquam, corporis deserunt ea eius eligendi enim est incidunt ipsam nisi odit officia omnis quibusdam quisquam quo recusandae saepe sed! A adipisci consectetur consequatur delectus distinctio error eum explicabo facere hic, illo iusto nemo nesciunt nulla, omnis provident qui repellat! Esse impedit quod reprehenderit voluptatum?</p>
      <ul>
        <li>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores doloribus dolorum ex, minus officiis perspiciatis!
        </li>
        <li>
          Animi deserunt dignissimos doloremque harum iure, iusto natus nobis rerum sit suscipit voluptate voluptatem voluptatibus.
        </li>
        <li>
          Cupiditate debitis, deserunt earum, eligendi error explicabo facilis inventore maxime nobis pariatur praesentium unde. Numquam.
        </li>
      </ul>
      <section class="verwerkingen">
        <div id="filter" class="filter-section">
          <h2>Zoek verwerking</h2>
          <form>
            <div class="form-item">
              <label for="name">Naam <span class="label-optional">(Optioneel)</span></label>
              <input id="name" :value="$route.query.name" type="text" name="name">
            </div>
            <div class="form-item">
              <label for="service">Verwerkende dienst <span class="label-optional">(Optioneel)</span></label>
              <input id="service" :value="$route.query.service" type="text" name="service"
                     placeholder="vb. Burgerzaken, MSOC, ...">
            </div>
            <div class="form-item">
              <label for="datatypes">Welke gegevens <span class="label-optional">(Optioneel)</span></label>
              <input id="datatypes" :value="$route.query.datatypes" type="text" name="datatypes">
            </div>
            <div class="form-item">
              <label for="receiver">Ontvanger <span class="label-optional">(Optioneel)</span></label>
              <input id="receiver" :value="$route.query.receiver" type="text" name="receiver" placeholder="vb. OCMW">
            </div>
            <button class="button button-primary">Zoek</button>
          </form>
          <h2>Verfijn resultaten</h2>
          <h3>Categorie</h3>
          <h3>Rechtsgrond</h3>
        </div>
        <div id="result" class="result-section">
          <div v-if="selectedFilters.length > 0" class="selected-filters">
            <h2>U koos voor:</h2>
            <template v-for="filter in selectedFilters" >
              <span :key="filter.key" class="tag filter">
                {{ filter.value }}
                <button @click="clearFilter(filter)"><span class="visually-hidden">Verwijder deze filter</span></button>
              </span>
            </template>
          </div>
          <h2>We vonden {{ total }} {{ total === 1 ? 'resultaat' : 'resultaten' }}</h2>
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

export default {
  head() {
    return {
      title: "verwerkingsregister"
    }
  },
  meta: {},
  components: { teaser, pagination },
  watchQuery: ["page"].concat(this.allowedFilters),
  async fetch({ store }) {
    await store.dispatch("GET_ITEMS")
  },
  data() {
    return {
      itemsPerPage: 10,
      allowedFilters: ["name", "service", "datatypes", "receiver"]
    }
  },
  asyncData({ query }) {
    return {
      queryPage: query.page || 1
    }
  },
  computed: {
    items() {
      return this.$store.state.items || []
    },
    filteredItems() {
      return this.items.filter(item => {
        if (
          this.$route.query.name &&
          item.name.value
            .toUpperCase()
            .indexOf(this.$route.query.name.toUpperCase()) === -1
        ) {
          return false
        }
        return true
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
      if (this.queryPage <= 0 || isNaN(this.queryPage)) {
        return 1
      }
      if (this.queryPage > this.totalPages) {
        return this.totalPages
      }
      return this.queryPage
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
  methods: {
    clearFilter(filter) {
      let query = Object.assign({}, this.$route.query)
      delete query[filter.key]
      delete query.page

      this.$router.push({
        query: query,
        force: true
      })
    }
  }
}
</script>

<style>
</style>
