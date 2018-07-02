import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase"
import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

// TODO: read https://medium.com/js-dojo/build-a-realtime-chat-app-with-vuejs-vuex-and-firestore-32d081668709

import { db } from "@/firebase"

const state = {
  db: db
}

import users from './users'
import tags from './tags'
import texts from './texts'
import authors from './authors'
import components from './components'

export var store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production', // strict in dev but not prod
  state,
  modules: {
    users,
    tags,
    texts,
    authors,
    components
  },
  mutations: {
    ...firebaseMutations,
    // Loading
    setLoaded(state, payload) {
      state.dataLoaded[payload.collection] = payload.loaded
    }
  },
  getters: {
    dataLoadingProgress(state, getters) {
      var modules = [
        "tags",
        "texts",
        "authors"
      ]
      var res = {
        modules: [],
        total: 0
      }
      modules.forEach(m => {
        var loaded = getters[m + "/dataLoaded"]
        if (loaded) {
          res.total += 1 / modules.length
        }
        res.modules.push({
          name: m,
          loaded: loaded
        })
      })
      res.total = res.total * 100
      return res
    },
    dataLoaded(state, getters) {
      return getters.dataLoadingProgress.total == 100
    }

  }
})