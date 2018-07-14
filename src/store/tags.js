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
  tagsIds: state => state.tags.map(t => t.id),
  // Queries
  tagById: state => id => state.tags.find(t => t.id == id) || {},
  groupById: state => id => state.tagGroups.find(g => g.id == id) || {},
  groupByTagId: state => tagId => state.tagGroups.find(g => g.tags.some(t => t == tagId)),
  isTag: state => id => state.tags.some(t => t.id == id),
  groupTagCount: (state, getters) => {
    // Returns a function (groupID => number of tags in group)
    return id => {
      var group = getters.tagGroups.find(g => g.id == id)
      if (group && group.tags) { return group.tags.length } else { return 0 }
    }
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
