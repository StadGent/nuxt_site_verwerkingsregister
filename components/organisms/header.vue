<template>
  <header class="header">
    <div class="content-container">
      <logo />
    </div>
    <div class="site-name">
      <span>Verwerkingsregister</span>
    </div>
    <breadcrumbs v-if="hasBreadcrumbs" />
    <hr>
  </header>
</template>

<script>
import logo from '~/components/molecules/logo'
import breadcrumbs from '~/components/molecules/breadcrumbs'

export default {
  components: { logo, breadcrumbs },
  computed: {
    hasBreadcrumbs () {
      return (
        (this.$store.state.breadcrumbs &&
          this.$store.state.breadcrumbs.length > 0) === true
      )
    }
  }
}
</script>
