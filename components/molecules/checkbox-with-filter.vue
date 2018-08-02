<template>
  <fieldset class="form-item">
    <legend>{{ legend }} <span v-if="!required">(Optioneel)</span></legend>

    <div class="checkbox-filter__selected"/>
    <div class="checkbox-filter__modal">
      <button class="button icon-cross checkbox-filter__close">
        <span>Close</span><i class="icon-close" aria-hidden="true"/>
      </button>

      <header>
        <h3>{{ legend }} <span v-if="!required">(Optioneel)</span></h3>
      </header>

      <div class="form-item">
        <label :for="`checkboxes__filter_id_${legend}`">Filter onderstaande lijst</label>
        <input id="`checkboxes__filter_id_${legend}`" type="search"
               class="checkbox-filter__filter">
        <strong aria-live="polite" class="checkbox-filter__result-wrapper">
          We vonden <span class="checkbox-filter__result">#</span> resultaten.
        </strong>
      </div>

      <div class="checkbox-filter__checkboxes">
        <div v-for="(value, index) in items" :key="`${name}-chk-${index}`" class="checkbox">
          <input :value="value" :id="`${name}-chk-${index}`"
                 v-model="selectedItems"
                 :name="name" type="checkbox"
                 @change="updateValue">
          <label :for="`${name}-chk-${index}`">{{ value }}</label>
        </div>
      </div>

      <footer class="checkbox-filter__actions">
        <button class="button button-primary button-small checkbox-filter__submit">Bevestig selectie</button>
      </footer>

    </div>

    <div class="overlay checkbox-filter__close"/>

    <button class="button button-secondary button-small checkbox-filter__open">
      Selecteer ...
    </button>
  </fieldset>
</template>

<script>
export default {
  props: {
    required: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    legend: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    items: {
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
