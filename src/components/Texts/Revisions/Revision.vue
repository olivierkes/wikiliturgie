<template>
<v-card flat>
  <v-card-text>
    <h4 v-if="diff('title')"
        v-html="diff('title')"></h4>
    <p v-html="diff('content').split('\n').join('<br />')"></p>
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
      authors: "authors/authors",
      authorById: "authors/authorById",
      tags: "tags/tags",
      tagById: "tags/tagById"
    }),
    diff() {
      return key => {
        if (!this.now[key] && (!this.before || !this.before[key])) { return "" }
        if (!this.before) {
          var val = ""
          if (key == "author") {
            val = this.textAuthor(this.now)
          } else if (key == "licence") {
            val = this.readableLicence(this.now.licence)
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
              return "<span class='removed'>" + before + "</span> <span class='added'>" + after + "</span>"
            } else {
              return "<span class='unchanged'>" + after + "</span>"
            }
          } else {
            before = this.before[key] || ""
            after = this.now[key] || ""
          }
          if (key == "licence") {
            before = this.readableLicence(before)
            after = this.readableLicence(after)
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
      if (this.now.bible_ref || this.before && this.before.bible_ref) {
        md.push({
          title: "Référence biblique",
          key: "bible_ref"
        })
      }
      if (this.now.comments || this.before && this.before.comments) {
        md.push({
          title: "Remarques",
          key: "comments"
        })
      }
      if (this.now.toAdmins) {
        md.push({
          title: "Message aux admins",
          key: "toAdmins",
        })
      }
      if (this.now.licence !== null) {
        md.push({
          title: "Licence",
          key: "licence"
        })
      }
      return md
    },
    diffTags() {
      var res = []
      if (!this.before && this.now.tags) {
        this.now.tags.forEach(t => {
          res.push({
            name: this.tagName(t),
            color: "green"
          })
        })
      } else if (this.now.tags && this.before.tags) {
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
        return this.authorById(obj.author).name
      }
      return null
    },
    tagName(tagId) {
      return this.tagById(tagId).name
    },
    readableLicence(licence) {
      return licence == "wl" ? "WikiLiturgie" : licence == "dp" ? "Domaine public" : "Je ne sais pas"
    }
  }
}
</script>

<style lang="css">

.added, .removed {
  -webkit-box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  padding: 4px;
  margin: 2px;
  border-radius: 2px;
}

.added {
  color: #3a883d;
  background: #edffee;
}

.removed {
  color: #b30000;
  background: #fadad7;
  text-decoration: line-through;
}

.unchanged {
  color: grey;
}
</style>
