<template>
  <article class="detail-layout">
    <h1>{{ details.name ? details.name.value : "" }}</h1>
    <div class="summary-box box-top">
      <div class="inner-box">
        <h2 class="visually-hidden">samenvatting</h2>
        <dl>
          <div>
            <dt>Categorie</dt>
            <dd>{{ details.type ? details.type.value : "" }}</dd>
          </div>
          <div>
            <dt>Verwerkende dienst</dt>
            <dd>{{ details.processor ? details.processor.value : "" }}</dd>
          </div>
          <div>
            <dt>Rechtmatigheid</dt>
            <dd>{{ details.formal_framework ? details.formal_framework.value : "" }}</dd>
          </div>
        </dl>
        <div class="accolade "/>
      </div>
    </div>

    <h2>Beschrijving</h2>
    <p>{{ details.description ? details.description.value : "" }}</p>
    <h2>Gegevens</h2>
    <h3>Over wie?</h3>
    <p>{{ details.personalDataDescription ? details.personalDataDescription.value : "" }}</p>
    <h3>Welke persoonsgegevens?</h3>
    <ul v-if="details.personalData && details.personalData.value.length > 0">
      <li v-for="(value, index) in details.personalData.value" :key="index">{{ value }}</li>
    </ul>
    <p v-else>Er zijn geen persoonsgegevens van toepassing.</p>
    <h3>Welke gevoelige persoonsgegevens?</h3>
    <ul v-if="details.sensitivePersonalData && details.sensitivePersonalData.value.length > 0">
      <li v-for="(value, index) in details.sensitivePersonalData.value" :key="index">{{ value }}</li>
    </ul>
    <p v-else>Er zijn geen gevoelige persoonsgegevens van toepassing.</p>
    <h2>Rechtmatigheid</h2>
    <h3>Type</h3>
    <p>{{ details.formal_framework ? details.formal_framework.value : "" }}</p>
    <h3>Verduidelijking</h3>
    <p>{{ details.formal_framework_clarification ? details.formal_framework_clarification.value : "" }}</p>
    <h2>Ontvangers</h2>
    <ul v-if="details.grantees && details.grantees.value.length > 0" :class="details.grantees.value.length > 5 ? 'columns' : null">
      <li v-for="(value, index) in details.grantees.value" :key="index">{{ value }}</li>
    </ul>
    <h2>Bewaartermijn</h2>
    <p>{{ details.storagePeriod ? details.storagePeriod.value : "" }}</p>

  </article>
</template>

<script>
export default {
  head() {
    return {
      title: `${
        this.details.name ? this.details.name.value : ""
      } | verwerkingsregister`
    }
  },
  meta: {
    home: "/medewerkers"
  },
  middleware: "home",
  async fetch({ store, params, error }) {
    console.log("fetching")
    // Only fetch items once
    let id = params.id
    if (!id) {
      error({ statusCode: 404, message: "Post not found" })
    }
    if (!store.state.details[id]) {
      try {
        await store.dispatch("GET_DETAIL", id)
      } catch (err) {
        if (err.statusCode) {
          error(err)
        } else {
          error({
            statusCode: 500,
            message: err.code || "Unexpected error"
          })
        }
      }
    }
  },
  computed: {
    details() {
      let id = this.$route.params.id
      let result = {}
      if (id) {
        result = this.$store.state.details[id] || {}
      }
      return result
    }
  }
}
</script>

<style scoped>
.columns {
  columns: 320px;
  column-gap: 2rem;
}

li {
  font-size: inherit;
}
</style>
