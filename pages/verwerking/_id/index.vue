<template>
  <verwerking :item="details" />
</template>

<script>
import verwerking from '~/components/organisms/verwerking'

export default {
  head () {
    return {
      title: `${
        this.details.name ? this.details.name.value : ''
      } | verwerkingsregister`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.details.description
            ? this.details.description.value
            : 'De Stad en het OCMW Gent vinden de bescherming van jouw persoonsgegevens erg belangrijk.\n' +
              'Daarom vind je op deze pagina een overzicht van de verwerkingen van persoonsgegevens die we uitvoeren.'
        }
      ]
    }
  },
  meta: {
    breadcrumbs: [{ label: 'verwerkingsregister', path: '/' }]
  },
  components: { verwerking },
  computed: {
    details () {
      const id = this.$route.params.id
      let result = {}
      if (id) {
        result = this.$store.state.details[id] || {}
      }
      return result
    }
  },
  async fetch ({ store, params, error }) {
    // Only fetch items once
    const id = params.id
    if (!id) {
      error({ statusCode: 404, message: 'Post not found' })
    }
    if (!store.state.details[id]) {
      try {
        await store.dispatch('GET_DETAIL_CIV', id)
      } catch (err) {
        if (err.statusCode) {
          error(err)
        } else {
          error({
            statusCode: 500,
            message: err.code || 'Unexpected error'
          })
        }
      }
    }
  }
}
</script>
