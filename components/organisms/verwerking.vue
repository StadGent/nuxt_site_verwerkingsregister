<template>
  <article class="detail-layout">
    <h1>{{ item.name ? item.name.value : "" }}</h1>
    <div class="summary-box box-top">
      <div class="inner-box">
        <h2 class="visually-hidden">samenvatting</h2>
        <dl>
          <div>
            <dt>Categorie</dt>
            <dd>{{ item.type ? item.type.value : "" }}</dd>
          </div>
          <div>
            <dt>Verwerkende dienst</dt>
            <dd>{{ item.processor ? item.processor.value : "" }}</dd>
          </div>
          <div>
            <dt>Rechtmatigheid</dt>
            <dd>{{ item.formal_framework ? item.formal_framework.value : "" }}</dd>
          </div>
        </dl>
        <div class="accolade "/>
      </div>
    </div>

    <h2>Beschrijving</h2>
    <p>{{ item.description ? item.description.value : "" }}</p>
    <h2>Gegevens</h2>
    <h3 v-if="item.personalDataDescription || item.sensitivePersonalDataDescription">Over wie?</h3>
    <p v-if="item.personalDataDescription">{{ item.personalDataDescription.value }}</p>
    <p v-if="item.sensitivePersonalDataDescription">{{ item.sensitivePersonalDataDescription.value }}</p>
    <h3>Welke persoonsgegevens?</h3>
    <ul v-if="item.personalData && item.personalData.value.length > 0">
      <li v-for="(value, index) in item.personalData.value" :key="index">{{ value }}</li>
    </ul>
    <p v-else>Er zijn geen persoonsgegevens van toepassing.</p>
    <h3>Welke gevoelige persoonsgegevens?</h3>
    <ul v-if="item.sensitivePersonalData && item.sensitivePersonalData.value.length > 0">
      <li v-for="(value, index) in item.sensitivePersonalData.value" :key="index">{{ value }}</li>
    </ul>
    <p v-else>Er zijn geen gevoelige persoonsgegevens van toepassing.</p>
    <h2>Rechtmatigheid</h2>
    <h3>Type</h3>
    <p>{{ item.formal_framework ? item.formal_framework.value : "" }}</p>
    <h3 v-if="item.formal_framework_clarification">Verduidelijking</h3>
    <p v-if="item.formal_framework_clarification">{{ item.formal_framework_clarification.value }}</p>
    <h2 v-if="item.grantees && item.grantees.value.length">Ontvangers</h2>
    <ul v-if="item.grantees && item.grantees.value.length" :class="item.grantees.value.length > 5 ? 'columns' : null">
      <li v-for="(value, index) in item.grantees.value" :key="index">{{ value }}</li>
    </ul>
    <h2>Bewaartermijn</h2>
    <p>{{ item.storagePeriod ? item.storagePeriod.value : "" }}</p>

  </article>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
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
