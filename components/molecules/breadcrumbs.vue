<template>
  <nav class="breadcrumb section--default" aria-labelledby="system-breadcrumb">
    <div class="content-container">
      <h2 id="system-breadcrumb" class="visually-hidden">Breadcrumb</h2>
      <ol class="breadcrumb no-style">
        <li><a href="https://stad.gent">Stad.gent</a></li>
        <li v-for="(crumb, index) in crumbs" :key="index">
          <nuxt-link :to="crumb.path">{{ crumb.label }}</nuxt-link>
        </li>
        <li><span>Page title</span></li>
      </ol>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    crumbs() {
      return this.$store.state.breadcrumbs
    }
  }
}
</script>
