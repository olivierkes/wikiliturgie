import { store } from '@/store'; // path to your Vuex store

function snackbar(text) {
  store.dispatch("components/snackbar", text)
}

export { snackbar }