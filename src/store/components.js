import Vue from 'vue'

const state = {
  snackbar_visible: false,
  snackbar: {},
  dialog_visible: false,
  dialog: {},
  loader: false,
}

const getters = {
  snackbar_visible: state => state.snackbar_visible,
  snackbar: state => state.snackbar,
  dialog_visible: state => state.dialog_visible,
  dialog: state => state.dialog,
  loader: state => state.loader
}

const mutations = {
  snackbar(state, snackbar) {
    if (snackbar && snackbar.text) {
      state.snackbar = snackbar
      state.snackbar_visible = true
    } else {
      state.snackbar_text = ""
      state.snackbar_visible = false
    }
  },
  dialog(state, dialog) {
    if (dialog) {
      state.dialog = dialog
      state.dialog_visible = true
    } else {
      state.dialog_visible = false
    }
  },
  loader(state, visible) {
    state.loader = visible
  }
}

const actions = {
  snackbar({ commit }, snackbar) {
    commit("snackbar", snackbar)
  },
  dialog({ commit }, dialog) {
    commit("dialog", dialog)
  },
  loader({ commit }, visible) {
    commit("loader", visible)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}