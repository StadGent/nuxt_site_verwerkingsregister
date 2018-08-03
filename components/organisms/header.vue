<template>
  <header class="header">
    <div class="content-container">
      <logo/>
    </div>
    <breadcrumbs v-if="hasBreadcrumbs"/>
    <hr>

    <div class="subsite">
      <h1>Verwerkingsregister</h1>
    </div>

  </header>
</template>

<script>
import logo from "~/components/molecules/logo"
import breadcrumbs from "~/components/molecules/breadcrumbs"

export default {
  components: { logo, breadcrumbs },
  computed: {
    hasBreadcrumbs() {
      return (
        (this.$store.state.breadcrumbs &&
          this.$store.state.breadcrumbs.length > 0) === true
      )
    }
  }
}
</script>
