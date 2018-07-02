<template>
  <div class="cs--default container">
    <header class="header">
      <div class="content-container">
        <logo/>
      </div>
      <breadcrumbs/>
    </header>
    <main>
      <nuxt/>
    </main>
    <footer class="footer" role="contentinfo">
      <h2 class="visually-hidden">Footer</h2>
      <div class="footer-top">
        <div class="content-container">
          <div class="footer--column">
            <gent_info/>
          </div>
          <div class="footer--column">
            <city_links/>
          </div>
          <div class="footer--column">
            <post_address/>
          </div>
        </div>
      </div>
      <div class="footer-bottom content-container">
        <div class="footer--column">
          <partnership/>
        </div>
        <div class="footer--column">
          <social_media/>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

  import logo from '~/components/molecules/logo';
  import breadcrumbs from '~/components/molecules/breadcrumbs';
  import gent_info from '~/components/molecules/gent-info';
  import city_links from '~/components/molecules/city-links';
  import post_address from '~/components/molecules/post-address';
  import social_media from '~/components/molecules/social-media';
  import partnership from '~/components/molecules/partnership';

  export default {
    middleware: ['breadcrumbs'],
    components: {logo, breadcrumbs, gent_info, city_links, post_address, partnership, social_media},
    computed: {}
  };
</script>

<style>

</style>
