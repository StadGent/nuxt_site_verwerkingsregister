<template>
  <nav v-if="total > 1" class="pager" aria-labelledby="pagination_1">
    <h2 id="pagination_1" class="visually-hidden">
      Pagination
    </h2>
    <ul class="pager__items">
      <li v-if="1 !== +active" class="previous">
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query,{page: +active-1})}"
                   class="previous"
                   @click.native="blur"
        >
          Vorige
          <span class="visually-hidden">pagina</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query,{page: 1})}"
                   :title="`Ga naar pagina ${1}`"
                   :class="{active: 1 === +active}"
                   @click.native="blur"
        >
          <span class="visually-hidden">Pagina</span>
          {{ 1 }}
        </nuxt-link>
      </li>
      <li v-if="active > 3">
        ...
      </li>
      <li v-if="active - 1 > 1 && +active-1 !== total">
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query,{page: +active-1})}"
                   :title="`Ga naar pagina ${active-1}`"
                   @click.native="blur"
        >
          <span class="visually-hidden">Pagina</span>
          {{ +active - 1 }}
        </nuxt-link>
      </li>
      <li v-if="+active !==1 && +active !== total">
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query,{page: +active})}"
                   :title="`Ga naar pagina ${active}`"
                   class="active"
                   @click.native="blur"
        >
          <span class="visually-hidden">Pagina</span>
          {{ +active }}
        </nuxt-link>
      </li>
      <li v-if="active+1 < total">
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query,{page: +active+1})}"
                   :title="`Ga naar pagina ${ +active+1}`"
                   @click.native="blur"
        >
          <span class="visually-hidden">Pagina</span>
          {{ +active + 1 }}
        </nuxt-link>
      </li>
      <li v-if="total - active > 2">
        ...
      </li>
      <li>
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query, {page: total})}"
                   :title="`Ga naar pagina ${total}`"
                   :class="{active: total === +active}"
                   @click.native="blur"
        >
          <span class="visually-hidden">Pagina</span>
          {{ total }}
        </nuxt-link>
      </li>
      <li v-if="total !== +active" class="next">
        <nuxt-link :to="{path: `${this.$route.path}#result`, query: Object.assign({}, $route.query, {page: +active+1})}"
                   class="next"
                   @click.native="blur"
        >
          Volgende
          <span class="visually-hidden">pagina</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
/**
 * @typedef {object} ClickEvent
 */

export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  methods: {
    /**
     * Remove focus since the link value will be
     * updated after the click event.
     *
     * @param {ClickEvent} e
     */
    blur: (e) => {
      e.target.blur()
    }
  }
}
</script>
