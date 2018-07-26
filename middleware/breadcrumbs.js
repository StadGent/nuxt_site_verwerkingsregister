export default ({ store, route }) => {
  const meta = route.meta[0]
  if (meta && meta.breadcrumbs) {
    store.commit("SET_BREADCRUMBS", meta.breadcrumbs)
  } else {
    store.commit("SET_BREADCRUMBS", [])
  }
}
