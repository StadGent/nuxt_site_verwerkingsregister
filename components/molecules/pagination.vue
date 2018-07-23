<template>
  <nav class="pager" aria-labelledby="pagination_1">
    <h2 id="pagination_1" class="visually-hidden">Pagination</h2>
    <ul class="pager__items">
      <li v-if="1 !== active">
        <a href="#" class="previous">
          vorige
          <span class="visually-hidden">pagina</span>
        </a>
      </li>
      <li>
        <a href="#" :title="`Ga naar pagina ${1}`"
           v-bind:class="{active: 1 === active}">
          <span class="visually-hidden">Pagina</span>
          {{ 1 }}
        </a>
      </li>
      <li v-if="active > 3">...</li>
      <li v-if="active - 1 > 1 && active-1 !== total">
        <a href="#" :title="`Ga naar pagina ${active-1}`">
          <span class="visually-hidden">Pagina</span>
          {{ active - 1 }}
        </a>
      </li>
      <li v-if="active !==1 && active !== total">
        <a href="#" :title="`Ga naar pagina ${active}`"
           class="active">
          <span class="visually-hidden">Pagina</span>
          {{ active }}
        </a>
      </li>
      <li v-if="active+1 < total">
        <a href="#" :title="`Ga naar pagina ${active+1}`">
          <span class="visually-hidden">Pagina</span>
          {{ active + 1 }}
        </a>
      </li>
      <li v-if="total - active > 3">...</li>
      <li>
        <a href="#" :title="`Ga naar pagina ${total}`"
           v-bind:class="{active: total === active}">
          <span class="visually-hidden">Pagina</span>
          {{ total }}
        </a>
      </li>
      <li v-if="total !== active">
        <a href="#" class="next">
          volgende
          <span class="visually-hidden">pagina</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    props: ['total', 'active']
  };
</script>
