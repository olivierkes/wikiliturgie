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
          <v-flex xs4
                  v-for="group in tagGroups">
            <v-toolbar dense dark
                       color="primary">
              <v-toolbar-title>{{ group.name }}</v-toolbar-title>
            </v-toolbar>
            <v-card>
              <v-list dense>
                <v-list-tile v-for="tag in group.tags"
                             :key="tag"
                             avatar
                             @click="">
                  <v-list-tile-content>
                    <v-list-tile-title>{{tags.find(t => t.id == tag).name}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon  :color="Math.random() > .5 ? 'pink' : ''">star</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
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
      widgets: false
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
    })
  }
}
</script>
