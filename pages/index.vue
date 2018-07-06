<template>
  <section class="content-container">
    <div>
      <h1 class="title">
        verwerkingsregister
      </h1>
      <ul class="grid-3">
        <li v-for="item in items" :key="item" class="teaser">
          <article>
            <div class="content-bottom">
              <h3>{{item.name.value}}</h3>
              <p>
                <a :href=item.url.value class="standalone-link">website <span
                class="visually-hidden">van {{item.name.value}}</span></a> <br>
                <strong>organisator </strong><span>{{item.contributor.value}}</span> <br>
                <strong v-if="item.free.value == 1">gratis </strong>
              </p>
              <nuxt-link :to=" `verwerking/${item.id}` " class="standalone-link">
                lees meer <span class="visually-hidden">over {{item.name.value}}</span>
              </nuxt-link>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>

  export default {
    head () {
      return {
        title: 'verwerkingsregister'
      };
    },
    meta: {},
    components: {},
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
