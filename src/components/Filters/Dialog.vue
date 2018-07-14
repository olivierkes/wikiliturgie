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
        <v-spacer></v-spacer>
        <v-btn icon
               dark>
          <v-icon>check</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container grid-list-lg>
        <v-layout wrap>
          <v-flex xs12> <b>Value: </b>{{value}}
            <hr /> <b>Selected tags:</b> {{selectedTags}} </v-flex>
          <v-flex xs6
                  v-for="group in tagGroups">
            <v-toolbar dense
                       dark
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
    value(newval, oldval) {
      console.log("Value Changed:")
      console.log(oldval)
      console.log(newval)
      if (!this.listOfTagsEquals(this.value, this.selectedTags)) {
        this.selectedTags = this.value
      }
    },
    selectedTags(newval, oldval) {
      console.log("SELECTed tag changed:")
      console.log(oldval)
      console.log(newval)
      if (!this.listOfTagsEquals(newval, oldval)) {
        console.log("EMITTING!!")
        this.$emit("input", this.computedTags)
      }
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      tagObject: "tags/tagObject"
    })
  },
  methods: {
    listOfTagsEquals(a, b) {
      console.log("EQUALS???", a.sort().join("") == b.sort().join(""))
      console.log(a.sort().join(""))
      console.log(b.sort().join(""))
      return a.sort().join("") == b.sort().join("")
    }
  }
}
</script>
