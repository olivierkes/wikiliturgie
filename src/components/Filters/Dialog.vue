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
        <v-toolbar-title>Filtres</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon
               dark
               @click.native="$emit('close')">
          <v-icon>check</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container grid-list-lg>
        <v-layout wrap>
          <!-- Warning -->
          <v-flex xs12>
            <v-alert :value="true"
                     type="warning"
                     v-if="warningLessThanTwoTags && !(selected && selected.length >= 2)"><b>Entre si possible au moins 2 tags.</b> Pour la plupart des textes, il faut remplir au minimum les catégories <code>Moment de culte</code> et <code>Occasion</code>.</v-alert>
                   </v-flex>
          <!-- Tags -->
          <v-flex xs6
                  v-for="group in tagGroups"
                  :key="group.id">
            <v-toolbar dense
                       dark
                       color="primary">
              <v-toolbar-title>{{ group.name }}</v-toolbar-title>
            </v-toolbar>
            <v-select v-model="selected"
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
          <!-- Authors -->
          <v-flex xs6 v-if="includeAuthors">
            <v-toolbar dense
                       dark
                       color="primary">
              <v-toolbar-title>Auteurs</v-toolbar-title>
            </v-toolbar>
            <v-select v-model="selected"
                      :items="authors"
                      multiple
                      item-text="name"
                      item-value="id"
                      dense
                      small-chips
                      deletable-chips
                      solo
                      chips
                      label="Auteurs"></v-select>
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
    "show": Boolean, // Is dialog visible
    "includeAuthors": Boolean, // Includes authors with tags
    "warningLessThanTwoTags": Boolean // Shows a warning if less than 2 tags are selected
  },
  data() {
    return {
      selected: null
    }
  },
  watch: {
    value() {
      this.selected = this.value
    },
    selected() {
      this.$emit("input", this.selected)
    },
    show() {
      this.selected = this.value
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      authors: "authors/authors"
    })
  }
}
</script>
