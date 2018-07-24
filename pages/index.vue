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
        <div id="filter" class="filter">
          <h2>Zoek verwerking</h2>
          <form>
            <div class="form-item">
              <label for="name">Naam <span class="label-optional">(Optioneel)</span></label>
              <input id="name" type="text" name="name">
            </div>
            <div class="form-item">
              <label for="service">Verwerkende dienst <span class="label-optional">(Optioneel)</span></label>
              <input id="service" type="text" name="service" placeholder="vb. Burgerzaken, MSOC, ...">
            </div>
            <div class="form-item">
              <label for="datatypes">Welke gegevens <span class="label-optional">(Optioneel)</span></label>
              <input id="datatypes" type="text" name="datatypes">
            </div>
            <div class="form-item">
              <label for="receiver">Ontvanger <span class="label-optional">(Optioneel)</span></label>
              <input id="receiver" type="text" name="receiver" placeholder="vb. OCMW">
            </div>
            <button class="button button-primary">Zoek</button>
          </form>
          <h2>Verfijn resultaten</h2>
          <h3>Categorie</h3>
          <h3>Rechtsgrond</h3>
        </div>
        <div id="result" class="result">
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
  watchQuery: ["page"],
  async fetch({ store }) {
    await store.dispatch("GET_ITEMS")
  },
  data() {
    return {
      itemsPerPage: 10
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
      return this.items
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
    }
  }
}
</script>

<style>
</style>
