import Vue from 'vue'
import { firebaseAction } from 'vuexfire'
import { db } from "@/firebase"

const state = {
  all: {},
  texts: [],
  revisions: null,
  dataLoaded: false
}

const getters = {
  texts: state => state.texts,
  revisions: state => state.revisions,
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
  bindRevisionsForText: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef, commit, state }, textId) => {
    if (state.messages != null) { unbindFirebaseRef('revisions') }
    var ref = db.collection("texts").doc(textId).collection("revisions")
    bindFirebaseRef('revisions', ref)
  }),
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}