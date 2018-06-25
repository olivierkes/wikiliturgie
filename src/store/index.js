import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase"

Vue.use(Vuex)

// TODO: read https://medium.com/js-dojo/build-a-realtime-chat-app-with-vuejs-vuex-and-firestore-32d081668709

export const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
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
  },
  getters: {
    user(state) {
      return state.user
    }
  }
})