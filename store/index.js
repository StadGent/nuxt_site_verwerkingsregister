import Vuex from 'vuex';

export default () => {
  return new Vuex.Store({
    state: {
      breadcrumbs: []
    },
    mutations: {
      setBreadcrumbs (state, breadcrumbs) {
        state.breadcrumbs = breadcrumbs;
      }
    }
  });
}
