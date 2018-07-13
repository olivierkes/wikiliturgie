import Vue from 'vue'

const state = {
  snackbar_visible: false,
  snackbar: {}
}

const getters = {
  snackbar_visible: state => state.snackbar_visible,
  snackbar: state => state.snackbar,
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
  }
}

const actions = {
  snackbar({ commit }, snackbar) {
    commit("snackbar", snackbar)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}