<template>
  <footer class="footer" role="contentinfo">
    <h2 class="visually-hidden">
      Footer
    </h2>
    <div class="footer-top">
      <div class="content-container">
        <div class="footer--column">
          <gent-info />
        </div>
        <div class="footer--column">
          <city-links />
        </div>
        <div class="footer--column">
          <post-address />
        </div>
      </div>
    </div>
    <div class="footer-bottom content-container">
      <div class="footer--column">
        <partnership />
      </div>
      <div class="footer--column">
        <social-media />
      </div>
    </div>
  </footer>
</template>

<script>
import gentInfo from '~/components/molecules/gent-info'
import cityLinks from '~/components/molecules/city-links'
import postAddress from '~/components/molecules/post-address'
import socialMedia from '~/components/molecules/social-media'
import partnership from '~/components/molecules/partnership'

export default {
  components: { gentInfo, cityLinks, postAddress, partnership, socialMedia }
}
</script>
