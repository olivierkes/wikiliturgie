import firebase from "firebase"

const state = {
  all: {},
  currentUser: null
}

const mutations = {
  setUser(state, payload) {
    state.currentUser = payload
  }
}

const actions = {
  signIn({ commit }, payload) {
    firebase.auth().signInWithPopup(payload.provider)
      .then(function(result) {
        console.log("RESULT: ")
        console.log(result)
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        commit("setUser", user)
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        console.log("Error when signin in")
        console.log(error)
      })
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
