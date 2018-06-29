import Vue from 'vue'

const state = {
  snackbar: false,
  snackbar_text: ""
}

const getters = {
  snackbar: state => state.snackbar,
  snackbar_text: state => state.snackbar_text,
}

const mutations = {
  snackbar(state, text) {
    if (text) {
      state.snackbar_text = text
      state.snackbar = true
    } else {
      state.snackbar_text = ""
      state.snackbar = false
    }
  }
}

const actions = {
  snackbar({ commit }, text) {
    commit("snackbar", text)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}