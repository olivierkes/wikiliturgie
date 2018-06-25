import Vue from 'vue'
import { firebaseAction } from 'vuexfire'


const state = {
  all: {},
  texts: []
}

const getters = {
  texts: state => state.texts,
}

const mutations = {}

const actions = {
  setTextsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('texts', ref)
  }),
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}