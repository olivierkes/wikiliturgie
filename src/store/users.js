import firebase from "firebase"
import { db } from "@/firebase"
import { firebaseAction } from 'vuexfire'

const state = {
  all: {},
  users: [], // The 'users' collection
  currentUser: null,
  dataLoaded: false
}

const mutations = {
  setUser(state, payload) {
    state.currentUser = payload
  },
  setDataLoaded(state, payload) {
    state.dataLoaded = payload
  }
}

const actions = {
  signIn({ commit, state }, payload) {
    if (payload.user) {
      commit("setUser", payload.user)
      // Check if user exists in 'users' collection
      var user = state.users.find(u => u.uid == payload.user.uid)
      if (!user) {
        // user doesn't exists in 'users' collection, let's create it.
        db.collection("users").doc(payload.user.uid).set({
          role: "user",
          displayName: payload.user.displayName,
          photoURL: payload.user.photoURL
        })
      }
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
  },
  setUsersRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", false)
    bindFirebaseRef('users', ref).then(() => {
      commit("setDataLoaded", true)
    })
  }),
}

const getters = {
  users: state => state.users,
  dataLoaded: state => state.dataLoaded,
  user: state => state.currentUser,
  isAuthenticated: state => state.currentUser !== null && state.currentUser !== undefined,
  userById: state => id => state.users.find(u => u.id == id) || {},
  avatar: (state, getters) => id => getters.userById(id).photoURL
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}