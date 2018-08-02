/**
 * Get the breadcrumb property from the page metadata
 * and push them to the store.
 *
 * @param {Object} store
 * @param {Object} route
 */
export default ({ store, route }) => {
  const meta = route.meta[0]
  if (meta && meta.breadcrumbs) {
    store.commit("SET_BREADCRUMBS", meta.breadcrumbs)
  } else {
    store.commit("SET_BREADCRUMBS", [])
  }
}
