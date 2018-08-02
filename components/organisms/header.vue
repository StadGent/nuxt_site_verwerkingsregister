<template>
  <header class="header">
    <div class="content-container">
      <logo/>
    </div>
    <breadcrumbs/>
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
