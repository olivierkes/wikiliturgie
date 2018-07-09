<template>
<v-layout row
          justify-center>
  <v-dialog v-model="show"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark
                 dense
                 color="primary">
        <v-btn icon
               dark
               @click.native="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Filtres</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-lg>
        <v-layout wrap>
          <v-flex xs6
                  v-for="group in tagGroups">
            <v-toolbar dense dark
                       color="primary">
              <v-toolbar-title>{{ group.name }}</v-toolbar-title>
            </v-toolbar>
            <v-select v-model="selectedTags"
                      :items="group.tags.map(tagId => tags.find(t => t.id == tagId))"
                      multiple
                      item-text="name"
                      item-value="id"
                      dense
                      small-chips
                      deletable-chips
                      solo
                      chips
                      :label="group.name"></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import Vuex from "vuex"
export default {
  props: {
    "value": Array,
    "show": Boolean
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      selectedTags: null
    }
  },
  watch: {
    value() {
      this.selectedTags = this.value.map(t => t.id)
    },
    selectedTags() {
      this.$emit("value", this.computedTags)
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      tagObject: "tags/tagObject"
    }),
    computedTags() {
      if (this.selectedTags) {
        return this.selectedTags.map(tagId => this.tagObject(tagId))
      }
      return []
    },
    computedTagsId() {
      return this.computedTags.map(t => t.id)
    }
  }
}
</script>
