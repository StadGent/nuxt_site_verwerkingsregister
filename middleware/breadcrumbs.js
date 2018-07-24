export default ({ store, route }) => {
  const meta = route.meta[0]
  if (meta && meta.breadcrumbs) {
    store.commit("setBreadcrumbs", meta.breadcrumbs)
  } else {
    store.commit("setBreadcrumbs", [])
  }
}
