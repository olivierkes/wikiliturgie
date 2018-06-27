import Vue from 'vue'
import { firebaseAction } from 'vuexfire'


const state = {
  all: {},
  tags: [],
  tagGroups: []
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
  }
}

const mutations = {}

const actions = {
  setTagsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('tags', ref)
  }),
  setTagGroupsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('tagGroups', ref)
  }),
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}