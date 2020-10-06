<template>
  <footer class="footer">
    <h2 class="visually-hidden">
      Footer
    </h2>
    <div class="footer-top">
      <div class="content-container">
        <gent-info />
        <city-links />
        <social-media />
      </div>
    </div>
    <div class="footer-bottom content-container">
      <div class="footer--column">
        <ul class="">
          <li><a href="https://stad.gent/nl/over-gent-en-het-stadsbestuur/juridische-info/gebruiksvoorwaarden-website-stad-gent">Gebruiksvoorwaarden</a></li>
          <li><a href="https://stad.gent/nl/over-gent-en-het-stadsbestuur/juridische-info/met-respect-voor-uw-privacy">Privacy</a></li>
          <li><a href="https://stad.gent/nl/responsible-disclosure">Responsible disclosure</a></li>
        </ul>
      </div>
      <partnership />
    </div>
  </footer>
</template>

<script>
import gentInfo from '~/components/molecules/gent-info'
import cityLinks from '~/components/molecules/city-links'
import socialMedia from '~/components/molecules/social-media'
import partnership from '~/components/molecules/partnership'

export default {
  components: { gentInfo, cityLinks, partnership, socialMedia }
}
</script>
