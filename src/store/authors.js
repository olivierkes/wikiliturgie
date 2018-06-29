import Vue from 'vue'
import { firebaseAction } from 'vuexfire'


const state = {
  all: {},
  authors: []
}

const getters = {
  authors: state => state.authors,
}

const mutations = {}

const actions = {
  setAuthorsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('authors', ref)
  }),
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}