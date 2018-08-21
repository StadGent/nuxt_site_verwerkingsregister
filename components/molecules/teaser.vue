<template>
  <li class="teaser teaser-search">
    <article class="content-content">
      <div class="teaser__bottom">
        <h3 v-if="item.name">{{ item.name.value }}</h3>
        <ul>
          <li v-if="item.processor">{{ item.processor.value }}</li>
          <li v-if="item.formal_framework">{{ item.formal_framework.value }}</li>
          <li v-if="item.typeLabel">{{ item.typeLabel.value }}</li>
        </ul>
        <nuxt-link v-if="item.id && item.name" :to="`verwerking/${item.id.value}`" class="standalone-link">
          lees meer <span class="visually-hidden">over {{ item.name.value }}</span>
        </nuxt-link>
      </div>
    </article>
    <nuxt-link v-if="item.id && item.name" :to="`verwerking/${item.id.value}`" class="teaser-overlay-link" tabindex="-1" aria-hidden="true"/>
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
