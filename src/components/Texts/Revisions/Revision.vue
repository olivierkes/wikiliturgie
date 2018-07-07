<template>
<div>
  <v-layout row
            v-for="(d, k) in data"
            :key="k"
            v-if="now[k] && (!before || now[k] != before[k])">
    <v-flex xs3
            class="body-2">{{d}}</v-flex>
    <v-flex xs9>{{formattedData(k)}}</v-flex>
  </v-layout>
</div>
</template>

<script>
import Vuex from "vuex"
export default {
  props: {
    "now": Object,
    "before": Object
  },
  data() {
    return {
      data: {
        "title": "Titre",
        "content": "Texte",
        "author": "Auteur",
        "bible_ref": "Référence",
        "comment": "Commentaire"
      }
    }
  },
  computed: { ...Vuex.mapGetters({
      authors: "authors/authors"
    })
  },
  methods: {
    formattedData(key) {
      if (["title", "content", "bible_ref", "comment"].some(k => k == key)) {
        return this.now[key]
      } else if (key == "author") {
        return this.authors.find(a => a.id == this.now.author).name
      }
    }
  }
}
</script>
