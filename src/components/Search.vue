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
  <v-layout column>
    <!-- style="position: sticky; top: 50px; z-index: 10;" -->
    <v-flex>
      <v-layout column>
        <v-flex>
          <v-layout row>
            <v-flex xs11
                    sm10
                    offset-sm1>
              <tag-bar v-model="filters"
                       :tags="organizedTags"
                       allows-custom-search
                       :label="tagBarLabel"
                       solo></tag-bar>
            </v-flex>
            <v-flex xs1>
              <v-btn flat
                     icon
                     @click.native.stop="showFilterDialog = true">
                <v-icon center>settings</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row
                    wrap>
            <!-- Chip bar -->
            <v-flex xs12 md9>
              <chip-bar v-model="filters"
                        clearable></chip-bar>
            </v-flex>
            <v-flex xs12 md3>
              <v-icon small>keyboard_arrow_left</v-icon>
              <span class="grey--text" style="font-size:small;">{{searchedTexts.length}} textes</span>
              <v-icon small>keyboard_arrow_right</v-icon>
              <v-btn icon
                     small
                     disabled>
                <v-icon small>sort_by_alpha</v-icon>
              </v-btn>
              <v-btn icon
                     small
                     @click="viewSingleMode = !viewSingleMode">
                <v-icon small>{{ viewSingleMode ? "view_module" : "view_carousel" }}</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <filter-dialog v-model="filters"
                       :show="showFilterDialog"
                       @close="showFilterDialog = false"></filter-dialog>
      </v-layout>
    </v-flex>
    <v-flex fill-height>
      <texts-viewer :texts="searchedTexts"
                    :single-mode="viewSingleMode"></texts-viewer>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { db } from '@/firebase'
import Vuex from "vuex"
export default {
  data() {
    return {
      searchText: null,
      image: "",
      filters: [],
      showFilterDialog: false,
      viewSingleMode: false
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      organizedTags: "tags/organizedTags",
      texts: "texts/texts"
    }),
    searchedTexts() {
      if (this.searchText) {
        return this.texts.filter(txt => txt.content.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1)
      } else {
        return this.texts
      }
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
