<template>
  <li class="teaser teaser-search">
    <article class="teaser-content">
      <div class="teaser__bottom">
        <h3 v-if="item.name">{{ item.name.value }}</h3>
        <dl>
          <div v-if="item.type">
            <dt>Categorie</dt>
            <dd v-if="item.type">{{ item.type.value }}</dd>
          </div>
          <div v-if="item.processor">
            <dt>Verwerkende dienst</dt>
            <dd v-if="item.processor">{{ item.processor.value }}</dd>
          </div>
          <div v-if="item.formal_framework">
            <dt>Rechtmatigheid</dt>
            <dd v-if="item.formal_framework">{{ item.formal_framework.value }}</dd>
          </div>
        </dl>
        <nuxt-link v-if="item.id && item.name" :to="`verwerking/${item.id.value}`" class="standalone-link read-more" append>
          lees meer <span class="visually-hidden">over {{ item.name.value }}</span>
        </nuxt-link>
      </div>
    </article>
    <nuxt-link v-if="item.id && item.name" :to="`verwerking/${item.id.value}`" class="teaser-overlay-link" tabindex="-1" aria-hidden="true" append/>
  </li>
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
