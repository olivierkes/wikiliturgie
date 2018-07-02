import Vue from 'vue'
import { firebaseAction } from 'vuexfire'


const state = {
  all: {},
  tags: [],
  tagGroups: [],
  dataLoaded: {
    tags: false,
    tagGroups: false
  }
}

const getters = {
  tags: state => state.tags,
  tagGroups: state => state.tagGroups,
  organizedTags: (state, getters) => {
    var items = []
    getters.tagGroups.forEach(g => {
      items.push({ header: g.name, groupId: g.id })
      g.tags.forEach(tagID => {
        var tag = getters.tags.find(t => t.id == tagID)
        items.push({
          text: tag.name,
          group: g.name,
          groupId: g.id,
          type: "tag",
          id: tag.id
        })
      })
      // items.push({ divider: true, groupId: g.id})
    })
    return items
  },
  tagObject: (state, getters) => {
    return id => getters.organizedTags.find(ot => ot.id == id)
  },
  dataLoaded(state) {
    return state.dataLoaded.tags == true && state.dataLoaded.tagGroups == true
  }
}

const mutations = {
  setDataLoaded(state, payload) {
    state.dataLoaded[payload.collection] = payload.loaded
  }
}

const actions = {
  setTagsRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", { collection: "tags", loaded: false })
    bindFirebaseRef('tags', ref).then(() => {
      commit("setDataLoaded", { collection: "tags", loaded: true })
    })
  }),
  setTagGroupsRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
    commit("setDataLoaded", { collection: "tagGroups", loaded: false })
    bindFirebaseRef('tagGroups', ref).then(() => {
      commit("setDataLoaded", { collection: "tagGroups", loaded: true })
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