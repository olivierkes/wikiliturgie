<template>
<v-card flat>
  <v-card-text>
    <h4 v-if="diff('title')"
        v-html="diff('title')"></h4>
    <p v-html="diff('content')"></p>
    <v-divider v-if="metadata.length"></v-divider>
    <v-layout row
              wrap
              v-for="(md, i) in metadata"
              v-if="diff(md.key)"
              :key="i">
      <v-flex xs4
              class="body-2 grey--text"> {{md.title}} </v-flex>
      <v-flex xs8
              v-html="diff(md.key)"></v-flex>
    </v-layout>
    <v-chip v-for="t in diffTags"
            small
            label
            :color="t.color">{{t.name}}</v-chip>
  </v-card-text>
</v-card>
</template>

<script>
import Vuex from "vuex"
import { db } from '@/firebase'
import { snackbar } from "@/utils"
export default {
  props: {
    now: Object,
    before: Object
  },
  data() {
    return {}
  },
  computed: { ...Vuex.mapGetters({
      user: "users/user",
      userIsAuthenticated: "users/isAuthenticated",
      authors: "authors/authors",
      tags: "tags/tags"
    }),
    diff() {
      return key => {
        if (!this.now[key] && (!this.before || !this.before[key])) { return "" }
        if (!this.before) {
          var val = ""
          if (key == "author") {
            val = this.textAuthor(this.now)
          } else {
            val = this.now[key]
          }
          return "<span class='added'>" + val + "</span>"
        } else {
          var before = ""
          var after = ""
          if (key == "author" && (this.now.author || this.before.author)) {
            before = this.textAuthor(this.before) || ""
            after = this.textAuthor(this.now) || ""
            if (before != after) {
            return "<span class='removed'>" + before + "</span> <span class='added'>" + after + "</span>"}
            else {
              return "<span class='unchanged'>" + after + "</span>"
            }
          } else {
            before = this.before[key] || ""
            after = this.now[key] || ""
          }
          return this.$options.filters.diff(before, after)
        }
      }
    },
    metadata() {
      var md = []
      if (this.textAuthor) {
        md.push({
          title: "Auteur",
          key: "author"
        })
      }
      if (this.now.bible_ref) {
        md.push({
          title: "Référence biblique",
          key: "bible_ref"
        })
      }
      if (this.now.comments) {
        md.push({
          title: "Remarques",
          key: "comments"
        })
      }
      return md
    },
    diffTags() {
      var res = []
      if (!this.before) {
        this.now.tags.forEach(t => {
          res.push({
            name: this.tagName(t),
            color: "green"
          })
        })
      } else {
        this.now.tags.forEach(t => {
          res.push({
            name: this.tagName(t),
            color: this.before.tags.some(t2 => t2 == t) ? "grey" : "green"
          })
        })
        this.before.tags.forEach(t2 => {
          if (!this.now.tags.some(t => t == t2)) {
            res.push({
              name: this.tagName(t2),
              color: "red"
            })
          }
        })
      }
      return res
    }
  },
  methods: {
    textAuthor(obj) {
      if (obj.author) {
        return this.authors.find(a => a.id == obj.author).name
      }
      return null
    },
    tagName(tagId) {
      return this.tags.find(t => t.id == tagId).name
    }
  }
}
</script>

<style lang="css">
.added {
  color: #3a883d;
  background: #edffee;
}

.removed {
  color: #b30000;
  background: #fadad7;
}

.unchanged {
  color: grey;
}
</style>
