<template>
  <section class="content-container">
    <h1 class="overview-title">
      Lijst verwerkingen van persoonsgegevens voor
      <span class="overview-title-colon">medewerkers<span class="colon" aria-hidden="true"/></span>
    </h1>
    <aside class="box-top">
      <div class="inner-box">
        <introductietekst/>
        <div class="accolade "/>
      </div>
    </aside>
    <filter-layout :items="$store.state.items_emp"/>
  </section>
</template>

<script>
import introductietekst from "~/components/introductietekst"
import filterLayout from "~/components/organisms/filter_layout"

const Modal = require("~/node_modules/gent_styleguide/build/styleguide/js/modal.functions")
const CheckboxFilter = require("~/node_modules/gent_styleguide/build/styleguide/js/checkbox_filter.functions")

export default {
  head() {
    return {
      title: "verwerkingsregister"
    }
  },
  meta: {
    home: "/medewerkers"
  },
  middleware: "home",
  components: {
    introductietekst,
    filterLayout
  },
  watchQuery: ["page"].concat(this.allowedFilters),
  // Key needed to enable watchQuery and update form values
  key: to => to.fullPath,
  async fetch({ store, error }) {
    // Only fetch items once
    if (store.state.items_emp.length === 0) {
      try {
        await store.dispatch("GET_ITEMS_EMP")
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
    // init gent_styleguide modal
    const filter = document.querySelector("#filter")
    new Modal(filter, {
      resizeEvent: () => {
        if (window.innerWidth > 768) {
          filter.setAttribute("aria-hidden", "false")
        } else {
          filter.setAttribute("aria-hidden", "true")
        }
      }
    })

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
