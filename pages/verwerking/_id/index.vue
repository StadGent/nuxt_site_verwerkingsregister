<template>
  <verwerking :item="details"/>
</template>

<script>
import verwerking from "~/components/organisms/verwerking"

export default {
  head() {
    return {
      title: `${
        this.details.name ? this.details.name.value : ""
      } | verwerkingsregister`
    }
  },
  meta: {
    breadcrumbs: [{ label: "verwerkingsregister", path: "/" }]
  },
  components: { verwerking },
  async fetch({ store, params, error }) {
    // Only fetch items once
    let id = params.id
    if (!id) {
      error({ statusCode: 404, message: "Post not found" })
    }
    if (!store.state.details[id]) {
      try {
        await store.dispatch("GET_DETAIL_CIV", id)
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
