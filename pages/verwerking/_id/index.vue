<template>
  <article class="content-container">
    <h1>HALLO verwerking nummer {{$route.params.id}}!</h1>
  </article>
</template>

<script>
  export default {
    head () {
      return {
        title: `${this.$route.params.id} | verwerkingsregister`
      };
    },
    meta: {
      breadcrumbs: [
        {label: 'verwerkingsregister', path: '/'}
      ]
    }
  };
</script>
