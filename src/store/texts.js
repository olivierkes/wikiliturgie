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
  textById: state => id => state.texts.find(t => t.id == id),
  revisions: state => state.revisions,
  revisionById: state => id => state.revisions.find(r => r.id == id),
  dataLoaded: state => state.dataLoaded,
  problematicTexts: state => state.texts.filter(txt => {
    // Message to admin
    if (txt.toAdmins) { return true }
    // Not enough tags
    if (!txt.tags || txt.tags.length < 2) { return true }
  }),
  isTextProblematic: (state, getters) => id => getters.problematicTexts.some(t => t.id == id)
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