<template>
  <div class="cs--default container">
    <v_header/>
    <main>
      <nuxt/>
    </main>
    <v_footer/>
  </div>
</template>

<script>
  import v_header from '~/components/organisms/header';
  import v_footer from '~/components/organisms/footer';

  export default {
    middleware: ['breadcrumbs'],
    components: {v_header, v_footer},
  };
</script>

<style>
  main {
    margin-bottom: 4rem;
  }
</style>
