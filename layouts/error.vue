<template>
  <article v-if="error.statusCode === 404" class="detail-layout">
    <h1>We kunnen de pagina die je zoekt niet vinden</h1>
    <div class="help-block highlight">
      <div class="highlight__inner">
        <div>
          <h2>Hoe kunnen we je verder helpen?</h2>
          <div class="help-block-section">
            <h3>1. Verder navigeren vanaf hier?</h3>
            <p>
              Dat kan op verschillende manieren:
            </p>
            <ul class="icon-list">
              <li>
                <i class="icon-home" aria-hidden="true" /><span>Terugkeren naar de <nuxt-link :to="'/'">homepage</nuxt-link></span>
              </li>
              <li>
                <i class="icon-fancyback" aria-hidden="true" /><span>De terugknop van je browser gebruiken</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="404-poetry">
      <h2>Speurtocht</h2>
      <p>
        we kamden de stad uit,<br>
        braken tegels los, keerden <br>
        kapelletjes, kerken, begraafplaatsen <br>
        ondersteboven, daalden in waterputten af, <br>
        stonden met huiszoekingsbevelen te zwaaien.<br>
        <br>
        helaas, wat u zocht, heeft zich verstopt<br>
        bij het verdwenen paneel van het Lam Gods.
      </p>
      <p><strong>David Troch, Stadsdichter Gent</strong></p>
    </div>
  </article>
  <article v-else-if="error.statusCode === 403" class="detail-layout">
    <h1>Geen toegang tot deze pagina</h1>
    <div class="help-block highlight">
      <div class="highlight__inner">
        <div>
          <h2>Vanaf hier kan je...</h2>
          <ul class="icon-list">
            <li>
              <i class="icon-home" aria-hidden="true" /><span>Terugkeren naar de
                <nuxt-link :to="'/'">homepage</nuxt-link></span>
            </li>
            <li>
              <i class="icon-fancyback" aria-hidden="true" /><span>De terugknop van je browser gebruiken</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
  <article v-else class="detail-layout">
    <h1>Er ging iets fout met het opvragen van deze pagina</h1>
    <div class="help-block highlight">
      <div class="highlight__inner">
        <div>
          <h2>Vanaf hier kan je...</h2>
          <ul class="icon-list">
            <li>
              <i class="icon-home" aria-hidden="true" /><span>Terugkeren naar de
                <nuxt-link :to="'/'">homepage</nuxt-link></span>
            </li>
            <li>
              <i class="icon-fancyback" aria-hidden="true" /><span>De terugknop van je browser gebruiken</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    error: {
      type: [Error, Object],
      required: true
    }
  },
  layout: 'default'
}
</script>
