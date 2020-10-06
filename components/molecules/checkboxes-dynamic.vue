<template>
  <fieldset v-if="items.length < 6" class="form-item">
    <legend>{{ legend }}</legend>
    <div class="form-item">
      <div v-for="(item, index) in items" :key="`${id}-chk-${index}`" class="checkbox">
        <input :id="`${id}-chk-${index}`" v-model="selectedItems"
               :value="item"
               :name="name" type="checkbox"
               @change.prevent="updateValue">
        <label :for="`${id}-chk-${index}`">{{ item }}</label>
      </div>
    </div>
  </fieldset>
  <fieldset v-else class="form-item stacked checkbox-filter-dynamic">
    <legend>{{ legend }}</legend>
    <div class="form-item">
      <div class="form-columns">
        <div v-if="items.length < 21" class="form-item-column">
          <div v-for="(item, index) in items.slice(0,3)" :key="`${id}-chk-${index}`" class="checkbox">
            <input :id="`${id}-chk-${index}`" v-model="selectedItems"
                   :value="item"
                   :name="name" type="checkbox"
                   @change.prevent="updateValue">
            <label :for="`${id}-chk-${index}`">{{ item }}</label>
          </div>
          <div class="checkbox-accordion">
            <div :id="id" class="accordion--content" aria-hidden="true" hidden="hidden">
              <div v-for="(item, index) in items.slice(3, 21)" :key="`${id}-chk-${index}`" class="checkbox">
                <input :id="`${id}-chk-${index}`" v-model="selectedItems"
                       :value="item"
                       :name="name" type="checkbox"
                       @change.prevent="updateValue">
                <label :for="`${id}-chk-${index}`">{{ item }}</label>
              </div>
            </div>
            <button type="button"
                    class="accordion--button button button-secondary button-small icon-left"
                    aria-expanded="false"
                    :aria-controls="id">
              Toon meer
            </button>
          </div>
        </div>
        <div v-else class="form-item-column">
          <div v-for="(item, index) in items.slice(0,3)" :key="`${id}-chk-${index}`" class="checkbox preview">
            <input :id="`${id}-chk-${index}-preview`"
                   :value="item"
                   :name="null"
                   :checked="selectedItems.indexOf(item) !== -1"
                   :data-original="`${id}-chk-${index}`"
                   type="checkbox">
            <label :for="`${id}-chk-${index}-preview`">{{ item }}</label>
          </div>
          <div :id="id"
               :class="`modal modal--fixed-height checkbox-filter__modal${modalOpen ? ' visible' : ''}`"
               :data-scrollable="'#' + id + '_scrollable'"
               tabindex="-1">
            <div class="modal-inner">
              <div class="modal-header">
                <button :data-target="id"
                        type="button"
                        class="button icon-cross modal-close checkbox-filter__close"
                        @click="close">
                  <span>Sluiten</span><i class="icon-close" aria-hidden="true" />
                </button>
              </div>
              <div :id="id + '_scrollable'" class="modal-content">
                <h2>{{ legend }}</h2>

                <div class="form-item checkbox-filter__filter__search-wrapper">
                  <input :id="`checkboxes__filter_id_${legend}`" type="search"
                         aria-label="Filter onderstaande lijst"
                         class="checkbox-filter__filter">
                  <p class="checkbox-filter__result-wrapper" aria-live="polite" aria-atomic="true">
                    We vonden <span class="checkbox-filter__result">#</span> resultaten.
                  </p>
                </div>
                <div class="tag-list-wrapper">
                  <ul class="tag-list checkbox-filter__selected" />
                </div>

                <fieldset class="form-item stacked">
                  <legend>{{ legend }}</legend>
                  <div class="form-item">
                    <div v-for="(item, index) in items" :key="`${id}-chk-${index}`" class="checkbox">
                      <input :id="`${id}-chk-${index}`" v-model="selectedItems"
                             :value="item"
                             :name="name" type="checkbox"
                             @change.prevent="updateValue">
                      <label :for="`${id}-chk-${index}`">{{ item }}</label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="modal-actions">
                <button :data-target="id"
                        type="button"
                        class="button button-primary checkbox-filter__submit modal-close">
                  Bevestig selectie
                </button>
              </div>
            </div>
            <div :data-target="id"
                 class="modal-overlay modal-close"
                 @click="close" />
          </div>
          <button type="button"
                  class="button button-secondary button-small icon-left icon-search checkbox-filter__open"
                  :aria-controls="id"
                  aria-expanded="false"
                  @click="open">
            Toon meer
          </button>
        </div>
        <div class="form-item-column" />
      </div>
    </div>
  </fieldset>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
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
  data () {
    return {
      selectedItems: this.value,
      tempItems: [],
      selectedCount: 0,
      modalOpen: false,
      hash: `#${this.id}`
    }
  },
  methods: {
    /**
     * Emit the selected items.
     */
    updateValue () {
      this.$emit('input', this.selectedItems)
    },
    /**
     * Close the modal and restore selectedItems.
     */
    close () {
      this.selectedItems = this.tempItems
      this.updateValue()
      this.modalOpen = false
    },
    /**
     * Open the modal and save selectedItems.
     */
    open () {
      this.modalOpen = true
      // make a shallow copy
      this.tempItems = this.selectedItems.slice()
    }
  }
}
</script>
