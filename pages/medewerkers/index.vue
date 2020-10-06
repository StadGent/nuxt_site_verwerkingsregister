<template>
  <section class="content-container">
    <h1 class="overview-title">
      <span class="overview-title-colon">
        Lijst verwerkingen van persoonsgegevens voor medewerkers
        <span class="colon" aria-hidden="true" />
      </span>
    </h1>
    <aside class="mb-20 highlight highlight--top">
      <div class="highlight__inner">
        <introductietekst />
      </div>
    </aside>
    <filter-layout :items="$store.state.items_emp" />
  </section>
</template>

<script>
import introductietekst from '~/components/introductietekst'
import filterLayout from '~/components/organisms/filter_layout'

export default {
  head () {
    return {
      title: 'verwerkingsregister'
    }
  },
  meta: {
    home: '/medewerkers'
  },
  middleware: 'home',
  components: {
    introductietekst,
    filterLayout
  },
  // Key needed to enable watchQuery and update form values
  key: to => to.fullPath,
  async fetch ({ store, error }) {
    // Only fetch items once
    if (store.state.items_emp.length === 0) {
      try {
        await store.dispatch('GET_ITEMS_EMP')
      } catch (err) {
        if (err.statusCode) {
          error(err)
        } else {
          error({
            statusCode: 500,
            message: err.code || 'Unexpected error'
          })
        }
      }
    }
  }
}
</script>

<style>
.selected-filters {
  padding-top: 1.2rem;
}
</style>
