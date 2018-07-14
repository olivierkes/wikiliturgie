import Vue from 'vue'
import { firebaseAction } from 'vuexfire'


const state = {
  all: {},
  authors: [],
  dataLoaded: false
}

const getters = {
  authors: state => state.authors,
  authorByUid: state => uid => state.authors.find(a => a.user == uid) || {},
  authorById: state => id => state.authors.find(a => a.id == id) || {},
  dataLoaded: state => state.dataLoaded,
  authorsIds: state => state.authors.map(a => a.id),
  isAuthor: state => id => state.authors.some(a => a.id == id)
}

const mutations = {
  setDataLoaded(state, payload) {
    state.dataLoaded = payload
  }
}

const actions = {
  setAuthorsRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", false)
    bindFirebaseRef('authors', ref).then(() => {
      commit("setDataLoaded", true)
    })
  }),
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}