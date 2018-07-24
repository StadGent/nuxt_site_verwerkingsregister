<template>
  <nav class="pager" aria-labelledby="pagination_1">
    <h2 id="pagination_1" class="visually-hidden">Pagination</h2>
    <ul class="pager__items">
      <li v-if="1 !== +active">
        <nuxt-link :to="{query: {page: +active-1}}" class="previous">
          vorige
          <span class="visually-hidden">pagina</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{query: {page: 1}}"
                   :title="`Ga naar pagina ${1}`"
                   v-bind:class="{active: 1 === +active}">
          <span class="visually-hidden">Pagina</span>
          {{ 1 }}
        </nuxt-link>
      </li>
      <li v-if="active > 3">...</li>
      <li v-if="active - 1 > 1 && +active-1 !== total">
        <nuxt-link :to="{query: {page: +active-1}}"
                   :title="`Ga naar pagina ${active-1}`">
          <span class="visually-hidden">Pagina</span>
          {{ +active - 1 }}
        </nuxt-link>
      </li>
      <li v-if="+active !==1 && +active !== total">
        <nuxt-link :to="{query: {page: +active}}"
                   :title="`Ga naar pagina ${active}`"
                   class="active">
          <span class="visually-hidden">Pagina</span>
          {{ +active }}
        </nuxt-link>
      </li>
      <li v-if="active+1 < total">
        <nuxt-link :to="{query: {page: +active+1}}" :title="`Ga naar pagina ${ +active+1}`">
          <span class="visually-hidden">Pagina</span>
          {{ +active + 1 }}
        </nuxt-link>
      </li>
      <li v-if="total - active > 3">...</li>
      <li>
        <nuxt-link :to="{query: {page: total}}"
                   :title="`Ga naar pagina ${total}`"
                   v-bind:class="{active: total === +active}">
          <span class="visually-hidden">Pagina</span>
          {{ total }}
        </nuxt-link>
      </li>
      <li v-if="total !== +active">
        <nuxt-link :to="{query: {page: +active+1}}"
                   class="next">
          volgende
          <span class="visually-hidden">pagina</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    props: ['total', 'active']
  };
</script>
