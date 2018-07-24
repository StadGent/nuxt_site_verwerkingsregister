<template>
  <section class="content-container">
    <div>
      <h1 class="title">
        verwerkingsregister
      </h1>
      <ul class="grid-1">
        <teaser v-for="(item, index) in paginatedItems"
                v-bind:key="item.id"
                v-bind:item="item"
                v-bind:index="index"/>
      </ul>
      <pagination
        v-bind:total="Math.ceil(filteredItems.length / itemsPerPage)"
        v-bind:active="currentPage"/>
    </div>
  </section>
</template>

<script>
  import teaser from '~/components/molecules/teaser';
  import pagination from '~/components/molecules/pagination';

  export default {
    head () {
      return {
        title: 'verwerkingsregister'
      };
    },
    meta: {},
    components: {teaser, pagination},
    watchQuery: ['page'],
    async fetch ({store}) {
      await store.dispatch('GET_ITEMS');
    },
    data () {
      return {
        itemsPerPage: 10,
      };
    },
    asyncData ({query}) {
      return {
        queryPage: query.page || 1
      };
    },
    computed: {
      items () {
        return this.$store.state.items;
      },
      filteredItems () {
        if (!this.items) {
          return;
        }
        return this.items;
      },
      total () {
        return Math.ceil(filteredItems.length / this.itemsPerPage);
      },
      paginatedItems () {
        if (!this.filteredItems) {
          return;
        }
        const index = this.currentPage * this.itemsPerPage - this.itemsPerPage;
        return this.filteredItems.slice(index, index + this.itemsPerPage);
      },
      currentPage () {
        if (this.queryPage <= 0 || isNaN(this.queryPage)) {
          return 1;
        }
        if (this.queryPage > total) {
          return total;
        }
        return this.queryPage;
      }
    }
  };
</script>

<style>

</style>
