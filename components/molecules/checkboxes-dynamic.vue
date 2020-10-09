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
          <div class="accordion-preview">
            <div v-for="(item, index) in previewItems" :key="`${id}-chk-${index}`" class="checkbox">
              <input :id="`${id}-chk-${item}`" v-model="selectedItems"
                     :value="item"
                     :name="name" type="checkbox"
                     @change.prevent="updateValue">
              <label :for="`${id}-chk-${item}`">{{ item }}</label>
            </div>
          </div>
          <div class="checkbox-accordion">
            <div :id="id" class="accordion--content" aria-hidden="true" hidden="hidden">
              <div v-for="(item, index) in accordionItems" :key="`${id}-chk-${index}`" class="checkbox">
                <input :id="`${id}-chk-${index}`" v-model="selectedItems"
                       :value="item"
                       :name="name" type="checkbox"
                       @change.prevent="updateValue">
                <label :for="`${id}-chk-${index}`">{{ item }}</label>
              </div>
            </div>
            <button v-if="accordionItems.length"
                    type="button"
                    class="accordion--button button button-secondary button-small icon-left"
                    aria-expanded="false"
                    :aria-controls="id">
              Toon meer
            </button>
          </div>
        </div>
        <div v-else class="form-item-column">
          <div class="modal-preview">
            <div v-for="(item, index) in previewItems" :key="`${id}-chk-${index}`" class="checkbox preview">
              <input :id="`${id}-chk-${encode(item)}-preview`"
                     :value="item"
                     :name="null"
                     :checked="selectedItems.indexOf(item) !== -1"
                     :data-original="`${id}-chk-${encode(item)}`"
                     type="checkbox">
              <label :for="`${id}-chk-${encode(item)}-preview`">{{ item }}</label>
            </div>
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
                  <ul class="tag-list checkbox-filter__selected">
                    <li v-for="(item, index) in selectedItems" :key="`selected-${index}`">
                      <span class="tag filter">{{ item }}
                        <button type="button" @click="uncheck(item)">
                          <span class="visually-hidden">Verwijder filter {{ item }}</span>
                        </button>
                      </span>
                    </li>
                  </ul>
                </div>

                <fieldset class="form-item stacked">
                  <legend>{{ legend }}</legend>
                  <div class="form-item">
                    <div v-for="(item, index) in items" :key="`${id}-chk-${index}`" class="checkbox">
                      <input :id="`${id}-chk-${encode(item)}`" v-model="selectedItems"
                             :value="item"
                             :name="name" type="checkbox"
                             @change.prevent="updateValue">
                      <label :for="`${id}-chk-${encode(item)}`">{{ item }}</label>
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
                 class="modal-overlay modal-close checkbox-filter__close"
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
      previewItems: [
        ...this.items.slice(0, 3),
        ...this.items.slice(3).filter(i => this.value.indexOf(i) !== -1)
      ],
      accordionItems: this.items.slice(3).filter(i => this.value.indexOf(i) === -1),
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
     * Close the modal.
     */
    close () {
      this.updateValue()
      this.modalOpen = false
    },
    /**
     * Open the modal.
     */
    open () {
      this.modalOpen = true
    },
    /**
     * Remove an item from the selection.
     *
     * @param item String
     */
    uncheck (item) {
      this.selectedItems = this.selectedItems.filter(i => i !== item)
      this.updateValue()
    },
    /**
     * btoa does not exist in node.js,
     * this regex keeps SSR possible.
     *
     * @param v String
     * @return string
     */
    encode (v) {
      return v.replace(/[^a-zA-Z]/g, '')
    }
  }
}
</script>
