import Vue from 'vue'
import { firebaseAction } from 'vuexfire'


const state = {
  all: {},
  texts: [],
  dataLoaded: false
}

const getters = {
  texts: state => state.texts,
  dataLoaded: state => state.dataLoaded
}

const mutations = {
  setDataLoaded(state, payload) {
    state.dataLoaded = payload
  }
}

const actions = {
  setTextsRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", false)
    bindFirebaseRef('texts', ref).then(() => {
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