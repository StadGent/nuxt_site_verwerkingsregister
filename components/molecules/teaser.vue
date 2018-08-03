<template>
  <li class="teaser">
    <article class="content-bottom">
      <h3>{{ item.name.value }}</h3>
      <p>
        <a :href="item.url.value" class="standalone-link">website <span
          class="visually-hidden">van {{ item.name.value }}</span></a> <br>
        <strong>organisator </strong><span>{{ item.processor.value }}</span> <br>
        <strong v-if="item.free.value == 1">gratis </strong>
      </p>
      <nuxt-link :to="`verwerking/${item.id}` " class="standalone-link">
        lees meer <span class="visually-hidden">over {{ item.name.value }}</span>
      </nuxt-link>
    </article>
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
