<template>
  <fieldset class="form-item checkbox-filter">
    <legend>{{ legend }} <span v-if="!required" class="label-optional">(Optioneel)</span></legend>

    <div :aria-hidden="`${!modalOpen}`"
         :class="`checkbox-filter__modal ${modalOpen ? 'visible' : ''}`"
         tabindex="-1">
      <div class="modal-actions">
        <button type="button"
                class="button icon-cross modal-close checkbox-filter__close"
                @click="close">
          <span>Sluiten</span><i class="icon-close" aria-hidden="true"/>
        </button>
      </div>
      <div class="checkbox-filter__content">
        <h3>{{ legend }} <span v-if="!required" class="label-optional">(Optioneel)</span></h3>
        <div class="form-item">
          <label :for="`checkboxes__filter_id_${legend}`">Filter onderstaande lijst</label>
          <input id="`checkboxes__filter_id_${legend}`" type="search"
                 class="checkbox-filter__filter">
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
        </div>
        <p class="checkbox-filter__result-wrapper">
          <strong aria-live="polite" class="checkbox-filter__result-wrapper">
            We vonden <span class="checkbox-filter__result">#</span> resultaten.
          </strong>
        </p>
        <div class="checkbox-filter__checkboxes">
          <div v-for="(value, index) in items" :key="`${name}-chk-${index}`" class="checkbox">
            <input :value="value" :id="`${name}-chk-${index}`"
                   v-model="selectedItems"
                   :name="name" type="checkbox"
                   @change.prevent="updateValue">
            <label :for="`${name}-chk-${index}`">{{ value }}</label>
          </div>
        </div>
      </div>
      <div class="checkbox-filter__actions">
        <button type="button" class="button button-primary button-small checkbox-filter__submit"
                @click="updateCount">Bevestig selectie</button>
      </div>
    </div>

    <div class="overlay checkbox-filter__close"
         @click="close" />

    <p v-if="selectedCount > 0">
      <strong><span class="checkbox-filter__count"/>{{ `${selectedCount} ${selected_legend} geselecteerd` }}</strong>
    </p>

    <button type="button"
            class="button button-secondary button-small checkbox-filter__open"
            @click="open">
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
    selected_legend: {
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
      modalOpen: false,
      selectedCount: 0
    }
  },
  mounted() {
    this.updateCount()
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
    },
    /**
     * Close the modal and restore selectedItems.
     */
    close() {
      this.selectedItems = this.tempItems
      this.updateCount()
      this.updateValue()
      this.modalOpen = false
    },
    /**
     * Open the modal and save selectedItems.
     */
    open() {
      this.modalOpen = true
      // make a shallow copy
      this.tempItems = this.selectedItems.slice()
    },
    /**
     * Updated the selected items count.
     */
    updateCount() {
      this.selectedCount = this.selectedItems.length
    }
  }
}
</script>

<style>
/*
Hide the styleguide required countspan,
replaced by our own.
*/
.checkbox-filter__count {
  display: none;
}

.checkbox-filter .checkbox-filter__modal .checkbox-filter__content {
  overflow-y: auto;
}
</style>
