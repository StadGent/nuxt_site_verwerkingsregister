<template>
  <fieldset class="form-item">
    <legend>Verwerkende dienst</legend>
    <div v-for="(name, index) in processors" :key="`processor-chk-${index}`" class="checkbox">
      <input :value="name" :id="`processor-chk-${index}`"
             v-model="selectedItems"
             name="processor[]" type="checkbox"
             @change="updateValue">
      <label :for="`processor-chk-${index}`">{{ name }}</label>
    </div>
  </fieldset>
</template>

<script>
export default {
  props: {
    processors: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      selectedItems: this.value
    }
  },
  methods: {
    updateValue() {
      this.$emit("input", this.selectedItems)
    }
  }
}
</script>
