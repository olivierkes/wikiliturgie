<template>
<!-- @mouseover="overflow = true" @mouseleave="overflow=false" -->
<v-card v-if="text"
        :hover="abstract && !overflow"
        @click.native="overflow=!overflow"
        :flat="flat">
  <v-card-text :style="style">
    <!-- <p v-html="$options.filters.md(text.content.slice(0, 300))"></p> -->
    <h4 v-if="text.title"
        class="grey--text">{{text.title}}</h4>
    <p v-html="$options.filters.md(text.content)"></p>
    <v-divider></v-divider>
    <v-layout row
              wrap
              v-for="(md, i) in metadata"
              :key="i">
      <v-flex xs4
              class="body-2 grey--text"> {{md.title}} </v-flex>
      <v-flex xs8
              class="grey--text">{{ md.value }}</v-flex>
    </v-layout>
    <v-chip v-for="t in text.tags"
            :key="t"
            small
            label>{{tags.find(tag => tag.id == t).name}}</v-chip>
  </v-card-text>
  <v-card-actions v-if="text.id"
                  :class="(!abstract || overflow)? '':'elevation-2'">
    <v-btn v-if="abstract"
           icon
           @click.native.stop="overflow = !overflow">
      <v-icon>{{ overflow ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-tooltip top>
      <v-icon v-if="!userIsAuthenticated && starCount"
              :color="starCount > 0 ? 'yellow' : 'grey'"
              slot="activator">star </v-icon> <span>{{starCount}} étoile{{starCount > 1 ? "s":""}}</span> </v-tooltip>
    <v-btn v-if="userIsAuthenticated"
           flat
           icon>
      <v-tooltip top>
        <v-icon :color="userStarred ? 'yellow' : 'grey'"
                @click="toggleStar"
                slot="activator">star</v-icon> <span>{{starCountDisplay}} étoile{{starCount > 1 ? "s":""}}</span> </v-tooltip>
    </v-btn>
    <v-btn v-if="userIsAuthenticated"
            flat
           icon
           @click.stop="toggleCart">
      <v-icon :color="textInCart? 'green' : 'grey'">shopping_cart</v-icon>
    </v-btn>
    <v-btn flat
           icon
           :to="'/text/' + text.id">
      <v-icon color="grey">edit</v-icon>
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import Vuex from "vuex"
import { db } from '@/firebase'
import { snackbar } from "@/utils"
export default {
  props: {
    text: Object,
    abstract: Boolean,
    flat: Boolean
  },
  data() {
    return {
      overflow: false,
    }
  },
  methods: {
    toggleStar() {
      if (!this.userIsAuthenticated) { return }
      var stars = this.text.stars || []
      var uid = this.user.id
      if (stars.some(s => s == uid)) {
        // Item is starred, we must destar
        stars = stars.filter(s => s !== uid)
      } else {
        // Item is not starred, we must star
        stars.push(uid)
      }
      // update Text object
      this.text.stars = stars
      db.collection("texts").doc(this.text.id).update(this.text)
    },
    toggleCart() {
      if (!this.userIsAuthenticated) { return }
      var cart = this.userCart
      if (this.textInCart) {
        // Remove
        cart = cart.filter(t => t !== this.text.id)
      } else {
        // Add
        cart.push(this.text.id)
      }
      db.collection("users").doc(this.user.id).update({
        cart: cart
      })
    }
  },
  computed: { ...Vuex.mapGetters({
      user: "users/user",
      userIsAuthenticated: "users/isAuthenticated",
      authors: "authors/authors",
      tags: "tags/tags",
      userCart: "users/userCart"
    }),
    style() {
      return {
        height: (!this.abstract || this.overflow) ? "" : "300px",
        overflowY: "hidden"
      }
    },
    metadata() {
      var md = []
      if (this.textAuthor) {
        md.push({
          title: "Auteur",
          value: this.textAuthor
        })
      }
      if (this.text.bible_ref) {
        md.push({
          title: "Référence biblique",
          value: this.text.bible_ref
        })
      }
      if (this.text.comments) {
        md.push({
          title: "Remarques",
          value: this.text.comments
        })
      }
      return md
    },
    textAuthor() {
      if (this.text.author) {
        return this.authors.find(a => a.id == this.text.author).name
      }
      return null
    },
    // Stars
    starCount() {
      return this.text.stars ? this.text.stars.length : 0
    },
    starCountDisplay() {
      return this.starCount ? this.starCount : "0"
    },
    userStarred() {
      if (!this.userIsAuthenticated) { return false }
      if (this.text.stars && this.text.stars.some(u => u == this.user.id)) {
        return true
      }
      return false
    },
    textInCart() {
      if (!this.userIsAuthenticated) { return false}
      return this.userCart.some(t => t == this.text.id)
    }
  }
}
</script>
