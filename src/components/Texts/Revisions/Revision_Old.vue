<template>
<div>
  <v-layout row
            v-for="(d, k) in data"
            :key="k"
            v-if="now[k] != '' && now[k] != null && (!before || isNotEqual(k))">
    <v-flex xs3
            class="body-2">{{d}}</v-flex>
    <v-flex xs9
            v-if="k == 'tags'">
      <v-chip v-for="(t, i) in formattedData(k)"
              :key="i"
              label
              small>{{t}}</v-chip>
    </v-flex>
    <v-flex xs9
            v-else>{{formattedData(k)}}</v-flex>
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
        "comment": "Commentaire",
        "tags": "Tags"
      }
    }
  },
  computed: { ...Vuex.mapGetters({
      authors: "authors/authors",
      tags: "tags/tags"
    })
  },
  methods: {
    formattedData(key) {
      if (["title", "content", "bible_ref", "comment"].some(k => k == key)) {
        return this.now[key]
      } else if (key == "author") {
        return this.authors.find(a => a.id == this.now.author).name
      } else if (key == "tags") {
        return this.now.tags.map(tagId => this.tags.find(t => t.id == tagId).name)
      }
    },
    isNotEqual(key) {
      if (key == "tags") {
        return this.now[key].sort().join("") != this.before[key].sort().join("")
      } else {
        return this.now[key] != this.before[key]
      }
    }
  }
}
</script>
