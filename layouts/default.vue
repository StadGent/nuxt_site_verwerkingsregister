<template>
  <div class="cs--cyan container">
    <a href="#main" class="skiplink">Overslaan en naar de inhoud gaan</a>
    <v-header />
    <main id="main">
      <nuxt />
    </main>
    <v-footer />
  </div>
</template>

<script>
import vHeader from '~/components/organisms/header'
import vFooter from '~/components/organisms/footer'

export default {
  components: { vHeader, vFooter }
}
</script>

<style>
main {
  margin-bottom: 4rem;
}
</style>
