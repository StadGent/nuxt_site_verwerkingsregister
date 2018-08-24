<template>
  <article class="content-container">
    <h1>{{ details.name.value }}</h1>
    <div class="summary-box box-top">
      <div class="inner-box">
        <h2 class="visually-hidden">samenvatting</h2>
        <dl>
          <div>
            <dt>Categorie</dt>
            <dd>{{ details.type.value }}</dd>
          </div>
          <div>
            <dt>Verwerkende dienst</dt>
            <dd>{{ details.processor.value }}</dd>
          </div>
          <div>
            <dt>Rechtmatigheid</dt>
            <dd>{{ details.formal_framework.value }}</dd>
          </div>
        </dl>
        <div class="accolade "/>
      </div>
    </div>

    <h2>Beschrijving</h2>
    <p>{{ details.description.value }}</p>
    <h2>Gegevens</h2>
    <h3>Over wie?</h3>
    <p>{{ details.personalDataDescription.value }}</p>
    <h3>Welke persoonsgegevens?</h3>
    <ul>
      <li v-for="(value, index) in details.personalData.value" :key="index">{{ value }}</li>
    </ul>
    <h3>Welke gevoelige persoonsgegevens?</h3>
    <ul>
      <li v-for="(value, index) in details.sensitivePersonalData.value" :key="index">{{ value }}</li>
    </ul>
    <h2>Rechtmatigheid</h2>
    <h3>Type</h3>
    <p>{{ details.formal_framework.value }}</p>
    <h3>Verduidelijking</h3>
    <p>{{ details.formal_framework_clarification.value }}</p>
    <h2>Ontvangers</h2>
    <ul>
      <li v-for="(value, index) in details.grantees.value" :key="index">{{ value }}</li>
    </ul>
    <h2>Bewaartermijn</h2>
    <p>{{ details.storagePeriod.value }}</p>

  </article>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.$route.params.id} | verwerkingsregister`
    }
  },
  meta: {
    breadcrumbs: [{ label: "verwerkingsregister", path: "/" }]
  },
  async fetch({ store, params }) {
    // Only fetch items once
    let id = params.id
    if (id && !store.state.details[id]) {
      await store.dispatch("GET_ITEM", id)
    }
  },
  computed: {
    details() {
      let id = this.$route.params.id
      if (id) {
        return this.$store.state.details[id]
      }
    }
  }
}
</script>
