import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase"
import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

// TODO: read https://medium.com/js-dojo/build-a-realtime-chat-app-with-vuejs-vuex-and-firestore-32d081668709

import db from "@/firebase"

const state = {
  db: db
}

import users from './users'
import tags from './tags'

export var store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production', // strict in dev but not prod
  state,
  mutations: {
    // mutations here
    ...firebaseMutations
  },
  modules: {
    users,
    tags
  }
})