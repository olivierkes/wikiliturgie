<template>
<v-container grid-list-md
             fill-height>
  <v-btn fixed
         dark
         fab
         bottom
         right
         color="red"
         to="/text/add">
    <v-icon>add</v-icon>
  </v-btn>
  <v-layout row wrap>
    <v-flex xs12>
      <tag-bar v-model="filters"
               include-authors
               allows-custom-text
               :label="tagBarLabel"
               solo
               show-count
               :texts="searchedTexts"
               hide-empty
               dialog-button></tag-bar>
    </v-flex>
    <!-- Chip bar -->
    <v-flex xs12>
      <chip-bar v-model="filters"
                clearable></chip-bar>
    </v-flex>
    <v-flex fill-height xs12>
      <texts-viewer :texts="searchedTexts"></texts-viewer>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { db } from '@/firebase'
import Vuex from "vuex"
import { filterTextsByIds } from "@/utils"
export default {
  data() {
    return {
      searchText: null,
      image: "",
      filters: []
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      texts: "texts/texts"
    }),
    searchedTexts() {
      return filterTextsByIds(this.texts, this.filters)
    },
    tagBarLabel() {
      return "Rechercher parmis " + this.texts.length + " textes liturgiques…"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
