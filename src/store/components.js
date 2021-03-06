import Vue from 'vue'

const state = {
  snackbar_visible: false,
  snackbar: {},
  dialog_visible: false,
  dialog: {},
  loader: false,
  backgroundImage: false,
  arrowBackVisible: false,
}

const getters = {
  snackbar_visible: state => state.snackbar_visible,
  snackbar: state => state.snackbar,
  dialog_visible: state => state.dialog_visible,
  dialog: state => state.dialog,
  loader: state => state.loader,
  backgroundImage: state => state.backgroundImage, // holds whether we have a background image
  arrowBackVisible: state => state.arrowBackVisible
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
  },
  backgroundImage(state, value) {
    state.backgroundImage = value
  },
  arrowBackVisible(state, value) {
    state.arrowBackVisible = value
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
  },
  backgroundImage({ commit }, value) {
    // Sets whether there is a background image for other components do adapts.
    // Mainly the mail navbar.
    // "dark" if the image is dark, and "light" if the image is light.
    commit("backgroundImage", value)
  },
  arrowBackVisible({ commit }, value) {
    commit("arrowBackVisible", value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}