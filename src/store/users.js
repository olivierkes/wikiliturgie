import firebase from "firebase"

const state = {
  all: {},
  currentUser: null,
}

const mutations = {
  setUser(state, payload) {
    state.currentUser = payload
  }
}

const actions = {
  signIn({ commit }, payload) {
    if (payload.user) {
      commit("setUser", payload.user)
    }
  },
  signOut({ commit }) {
    firebase.auth().signOut().then(function() {
      commit("setUser", null)
    }).catch(function(error) {
      console.log("Error in signing out.")
      console.log(error)
    })
  },
  autoSignIn({ commit }, payload) {
    commit("setUser", payload)
  }
}

const getters = {
  user: state => state.currentUser,
  isAuthenticated: state => state.currentUser !== null && state.currentUser !== undefined
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}