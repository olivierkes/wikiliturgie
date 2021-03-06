import Vue from 'vue'
import { firebaseAction } from 'vuexfire'
import { db } from "@/firebase"

const state = {
  all: {},
  docs: [],
  blogs: [],
  dataLoaded: false
}

const getters = {
  docs: state => state.docs,
  blogs: state => state.blogs,
  dataLoaded: state => state.dataLoaded
}

const mutations = {
  setDataLoaded(state, payload) {
    state.dataLoaded = payload
  }
}

const actions = {
  setDocsRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", false)
    bindFirebaseRef('docs', ref).then(() => {
      commit("setDataLoaded", true)
    })
  }),
  setBlogsRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", false)
    bindFirebaseRef('blogs', ref).then(() => {
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