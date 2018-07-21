<template>
<v-card v-if="text"
        :hover="isCardExpandable"
        @click.native="overflow=!overflow"
        :flat="flat"
        class="text-card">
  <v-toolbar v-if="text.title"
             flat>
    <h1 class="grey--text  subheading ">{{text.title}}</h1> </v-toolbar>
  <v-card-text :style="style" ref="cardText" v-resize="updateCardHeight">
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
    <v-tooltip top
               v-for="t in text.tags">
      <v-chip :key="t"
              small
              label
              slot="activator">{{tagById(t).name}}</v-chip> <span>{{groupByTagId(t).name}}</span></v-tooltip>
  </v-card-text>
  <v-card-actions v-if="text.id"
                  :class="isCardExpandable? '':'elevation-2'">
    <v-btn v-if="abstract && isCardExpandable"
           icon
           @click.native.stop="overflow = !overflow">
      <v-icon>{{ overflow ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <!-- Stars -->
    <v-tooltip top>
      <v-icon v-if="!userIsAuthenticated && starCount"
              :color="starCount > 0 ? 'yellow' : 'grey'"
              slot="activator">star </v-icon> <span>{{starCount}} étoile{{starCount > 1 ? "s":""}}</span> </v-tooltip>
    <v-btn v-if="userIsAuthenticated"
           flat
           icon>
      <v-tooltip top>
        <v-icon :color="userStarred ? 'yellow' : 'grey'"
                @click.stop="toggleStar"
                slot="activator">star</v-icon> <span>{{starCountDisplay}} étoile{{starCount > 1 ? "s":""}}</span> </v-tooltip>
    </v-btn>
    <!-- Cart -->
    <v-btn v-if="userIsAuthenticated"
           flat
           icon
           @click.stop="toggleCart">
      <v-icon :color="textInCart? 'green' : 'grey'">shopping_cart</v-icon>
    </v-btn>
    <!-- Problematic text -->
    <v-btn icon
           v-if="problemsByTextId(text.id).length"
           @click.stop="">
      <v-tooltip top>
        <v-icon color="amber lighten-3"
                slot="activator">warning</v-icon> <span>Problèmes: {{problemsByTextId(text.id).join(", ")}}</span> </v-tooltip>
    </v-btn>
    <!-- Edit -->
    <v-btn flat
           icon
           :to="'/text/' + text.id">
      <v-icon color="grey">edit</v-icon>
    </v-btn>
    <!-- Avatar -->
    <v-btn icon
           @click.stop=""
           v-if="text.created_by">
      <v-tooltip top>
        <v-avatar size="28"
                  slot="activator"> <img :src="avatar(text.created_by)" /> </v-avatar> <span>Crée par {{userById(text.created_by).displayName}} le {{text.created_on | date}}</span> </v-tooltip>
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import Vuex from "vuex"
import { db } from '@/firebase'
import { snackbar, loader } from "@/utils"
export default {
  props: {
    text: Object,
    abstract: Boolean,
    flat: Boolean
  },
  data() {
    return {
      overflow: false,
      cardHeight: 0,
      abstractHeight: 300,
    }
  },
  methods: {
    updateCardHeight() {
      this.cardHeight = this.$refs.cardText.clientHeight
    },
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
      loader(true)
      db.collection("texts").doc(this.text.id).update(this.text).then(() => {
        loader()
      })
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
      loader(true)
      db.collection("users").doc(this.user.id).update({
        cart: cart
      }).then(() => {
        loader()
      })
    }
  },
  computed: { ...Vuex.mapGetters({
      user: "users/user",
      userIsAuthenticated: "users/isAuthenticated",
      authors: "authors/authors",
      tags: "tags/tags",
      tagById: "tags/tagById",
      groupByTagId: "tags/groupByTagId",
      userCart: "users/userCart",
      avatar: "users/avatar",
      userById: "users/userById",
      problemsByTextId: "texts/problemsByTextId"
    }),
    isCardExpandable() {
      return this.cardHeight >= this.abstractHeight
    },
    style() {
      return {
        maxHeight: (!this.abstract || this.overflow) ? "" : this.abstractHeight + "px",
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
      if (!this.userIsAuthenticated) { return false }
      return this.userCart.some(t => t == this.text.id)
    }
  }
}
</script>

<style>
.text-card img {
  max-width: 100%;
}

.text-card ul,
.text-card ol {
  padding-top: 10px;
  padding-bottom: 15px;
}
</style>
