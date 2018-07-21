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
  <div class="overlay"
       :style="{opacity: centeredSearch ? 1 : 0}"></div>
  <v-layout v-if="centeredSearch"
            row
            fill-height
            align-center>
    <v-flex xs12>
      <p style="position: relative; width: 100%"
         class="text-xs-center white--text headline font-weight-thin"> Rechercher parmi {{texts.length}} textes litugiques </p>
      <tag-bar v-model="filters"
               include-authors
               allows-custom-text
               label=""
               solo
               show-count
               :texts="searchedTexts.length > 0 ? searchedTexts : texts"
               hide-empty
               dialog-button
               class="mb-3"></tag-bar>
      <p style="position: relative; width: 100%"
         class="text-xs-center white--text subheading font-weight-thin"> Tape pour rechercher ce qui t'intéresse </p>
    </v-flex>
  </v-layout>
  <v-layout v-if="!centeredSearch"
            row
            wrap>
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
    <v-flex fill-height
            xs12>
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
    centeredSearch() {
      return this.filters.length == 0
    },
    searchedTexts() {
      if (this.filters.length == 0) {
        return []
      }
      return filterTextsByIds(this.texts, this.filters)
    },
    tagBarLabel() {
      if (this.searchedTexts.length) {
        return "Rechercher parmi " + this.searchedTexts.length + " textes liturgiques…"
      } else {
        return "Aucun texte ne correspond à ta recherche."
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
div.overlay {
  /* background-image: url(https://mygracebase.com/wp-content/uploads/2016/08/church-location.jpg); */
  /* background-image: url(https://pixabay.com/get/e83db40c21f1013ed1534705fb094197e477e3d004b0144297f1c671afe8b3/arches-1853950_1920.jpg); */
  /* Source Image: https://pixabay.com/fr/%C3%A9glise-christianisme-cath%C3%A9drale-3481187/ */
  background-image: url("../assets/church-background_lq.jpg");
  background-size: cover;
  background-attachment: fixed;
  background-position-x: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  transform: scale(1.1);
}

/* nav.v-toolbar--fixed {
  background: url(https://mygracebase.com/wp-content/uploads/2016/08/church-location.jpg);
  background-size: cover;
  background-position-y: inherit;
  background-attachment: fixed;
} */
</style>
