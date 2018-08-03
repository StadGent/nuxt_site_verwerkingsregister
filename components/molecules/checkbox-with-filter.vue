<template>
  <fieldset class="form-item checkbox-filter">
    <legend>{{ legend }} <span v-if="!required">(Optioneel)</span></legend>

    <div class="checkbox-filter__selected">
      <span v-for="(value, index) in selectedItems" :key="`selected-${index}`"
            :data-value="value"
            class="tag filter">
        {{ value }}
        <button type="button" @click="removeTag(value)">
          <span class="visually-hidden">Verwijder tag</span>
        </button>
      </span>
    </div>

    <div :aria-hidden="modalOpen"
         :class="`checkbox-filter__modal ${modalOpen ? 'visible' : ''}`"
         tabindex="-1">
      <button type="button"
              class="button icon-cross checkbox-filter__close"
              @click="close">
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
                 @change.prevent="updateValue">
          <label :for="`${name}-chk-${index}`">{{ value }}</label>
        </div>
      </div>

      <footer class="checkbox-filter__actions">
        <button type="button" class="button button-primary button-small checkbox-filter__submit">Bevestig selectie</button>
      </footer>

    </div>

    <div class="overlay checkbox-filter__close"
         @click="close" />

    <button type="button"
            class="button button-secondary button-small checkbox-filter__open"
            @click="open">
      Selecteer ...
    </button>
  </fieldset>
</template>

<script>
const CheckboxFilter = require("~/assets/js/checkbox_filter.functions-min")

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
      selectedItems: this.value,
      tempItems: [],
      modalOpen: false
    }
  },
  mounted() {
    new CheckboxFilter(document.querySelector(".checkbox-filter"), {
      makeTags: false
    })
  },
  methods: {
    /**
     * Emit the selected items.
     */
    updateValue() {
      this.$emit("input", this.selectedItems)
    },
    /**
     * Remove an item from selectedItems.
     * @param {String} tag
     */
    removeTag(tag) {
      const index = this.selectedItems.indexOf(tag)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      }
      this.updateValue()
    },
    /**
     * Close the modal and restore selectedItems.
     */
    close() {
      this.modalOpen = false
      this.selectedItems = this.tempItems
      this.updateValue()
    },
    /**
     * Open the modal and save selectedItems.
     */
    open() {
      this.modalOpen = true
      this.tempItems = this.selectedItems
    }
  }
}
</script>
