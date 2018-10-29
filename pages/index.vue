<template>
  <section class="content-container">
    <h1 class="overview-title">
      <span class="overview-title-colon">Lijst verwerkingen van persoonsgegevens<span class="colon" aria-hidden="true"/></span>
    </h1>
    <aside class="box-top">
      <div class="inner-box">
        <introductietekst/>
        <div class="accolade "/>
      </div>
    </aside>
    <filter-layout :items="$store.state.items_civ"/>
  </section>
</template>

<script>
import introductietekst from "~/components/introductietekst"
import filterLayout from "~/components/organisms/filter_layout"

export default {
  head() {
    return {
      title: "Verwerkingsregister"
    }
  },
  components: {
    introductietekst,
    filterLayout
  },
  watchQuery: ["page"].concat(this.allowedFilters),
  // Key needed to enable watchQuery and update form values
  key: to => to.fullPath,
  async fetch({ store, error }) {
    // Only fetch items once
    if (store.state.items_civ.length === 0) {
      try {
        await store.dispatch("GET_ITEMS_CIV")
      } catch (err) {
        if (err.statusCode) {
          error(err)
        } else {
          error({
            statusCode: 500,
            message: err.code || "Unexpected error"
          })
        }
      }
    }
  },
  mounted() {
    const Modal = require("~/assets/styleguide/js/modal.functions")
    const CheckboxFilter = require("~/assets/styleguide/js/checkbox_filter.functions")

    // init gent_styleguide modal
    const filter = document.querySelector("#filter")
    new Modal(filter, {
      resizeEvent: () => {
        if (window.innerWidth > 768) {
          filter.setAttribute("aria-hidden", "false")
        } else {
          filter.setAttribute("aria-hidden", "true")
        }
      },
      changeHash: false
    })

    const modal = document.querySelectorAll(".modal:not(#filter)")
    for (let i = modal.length; i--; ) {
      new Modal(modal[i], { changeHash: false })
    }

    // init gent_styleguide checkbox-with-filters
    const checkboxWithFilters = document.querySelectorAll(".checkbox-filter")
    for (let i = checkboxWithFilters.length; i--; ) {
      new CheckboxFilter(checkboxWithFilters[i], {
        makeTags: false
      })
    }
  }
}
</script>

<style>
.selected-filters {
  padding-top: 1.2rem;
}

.box-top {
  margin-bottom: 2rem;
}
</style>
