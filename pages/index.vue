<template>
  <section class="content-container">
    <div>
      <h1 class="title">
        verwerkingsregister
      </h1>
      <ul class="grid-1">
        <teaser v-for="(item, index) in items"
                v-bind:key="item.id"
                v-bind:item="item"
                v-bind:index="index"/>
      </ul>
    </div>
  </section>
</template>

<script>
  import teaser from '~/components/molecules/teaser';

  export default {
    head () {
      return {
        title: 'verwerkingsregister'
      };
    },
    meta: {},
    components: {teaser},
    async fetch ({store, params}) {
      await store.dispatch('GET_ITEMS');
    },
    computed: {
      items () {
        return this.$store.state.items;
      }
    }
  };
</script>

<style>

</style>
