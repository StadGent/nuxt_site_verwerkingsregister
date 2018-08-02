<template>
  <header class="header">
    <div class="content-container">
      <logo/>
    </div>
    <breadcrumbs v-if="$store.state.breadcrumbs && $store.state.breadcrumbs > 0"/>
    <hr>
  </header>
</template>

<script>
import logo from "~/components/molecules/logo"
import breadcrumbs from "~/components/molecules/breadcrumbs"

export default {
  components: { logo, breadcrumbs }
}
</script>
