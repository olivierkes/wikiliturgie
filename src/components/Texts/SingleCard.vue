<template>
<v-card v-if="text"
        :hover="isCardExpandable"
        @click.native="overflow=!overflow"
        :flat="flat">
  <v-toolbar v-if="text.title"
             flat
             dense>
    <h1 class="subheading font-weight-light">{{text.title}}</h1> </v-toolbar>
  <v-card-text :style="style"
               ref="cardText"
               v-resize="updateCardHeight"
               class="text-card">
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
      <v-icon v-if="!userIsAuthenticated && starCountById(text.id)"
              :color="starCountById(text.id) > 0 ? 'yellow' : 'grey'"
              slot="activator">star </v-icon> <span>{{starCountById(text.id)}} étoile{{starCountById(text.id) > 1 ? "s":""}}</span> </v-tooltip>
    <v-btn v-if="userIsAuthenticated"
           flat
           icon>
      <v-tooltip top>
        <v-icon :color="userStarred ? 'yellow' : 'grey'"
                @click.stop="toggleStar"
                slot="activator">star</v-icon> <span>{{starCountById(text.id)}} étoile{{starCountById(text.id) > 1 ? "s":""}}</span> </v-tooltip>
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
  updated() {
    this.updateCardHeight()
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
      userIsAuthenticated: "users/userIsAuthenticated",
      authors: "authors/authors",
      tags: "tags/tags",
      tagById: "tags/tagById",
      groupByTagId: "tags/groupByTagId",
      userCart: "users/userCart",
      avatar: "users/avatar",
      userById: "users/userById",
      problemsByTextId: "texts/problemsByTextId",
      starCountById: "texts/starCountById"
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

/* TYPOGRAPHY */

.text-card blockquote,
.text-card dl,
.text-card figure,
.text-card form,
.text-card ol,
.text-card p,
.text-card pre,
.text-card table,
.text-card ul {
  margin-bottom: 1rem;
}

.text-card h1,
.text-card h2,
.text-card h3,
.text-card h4,
.text-card h5,
.text-card h6 {
  margin-bottom: 1rem;
  font-weight: lighter;
}

.text-card p {
  margin-top: 0;
}

.text-card a {
  text-decoration: none;
}
.text-card a[href*='//'] {
  padding-right: 15px;
  background: linear-gradient(transparent, transparent), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22%3E %3Cpath fill=%22%23fff%22 stroke=%22%2336c%22 d=%22M1.5 4.518h5.982V10.5H1.5z%22/%3E %3Cpath fill=%22%2336c%22 d=%22M5.765 1H11v5.39L9.427 7.937l-1.31-1.31L5.393 9.35l-2.69-2.688 2.81-2.808L4.2 2.544z%22/%3E %3Cpath fill=%22%23fff%22 d=%22M9.995 2.004l.022 4.885L8.2 5.07 5.32 7.95 4.09 6.723l2.882-2.88-1.85-1.852z%22/%3E %3C/svg%3E") no-repeat right;
}

.text-card a[href*='//']:after {}

/* BLOCS */

.text-card blockquote {
  border-left: 0.3rem solid #d1d1d1;
  margin-left: 0;
  margin-right: 0;
  padding: .5rem 1rem;
  color: #606c76;
}

.text-card blockquote *:last-child {
  margin-bottom: 0;
}

.text-card code {
  font-weight: normal;
}

.text-card pre {
  background: #f4f5f6;
  border-left: 0.3rem solid #888;
  overflow-y: hidden;
}

.text-card pre>code {
  border-radius: 0;
  display: block;
  padding: 1rem 1.5rem;
  white-space: pre;
  color: grey;
}

.text-card pre>code:after,
.text-card pre>code:before {
  content: "";
  letter-spacing: 0px;
}

/* LISTES */

.text-card dd,
.text-card dt,
.text-card li {
  margin-bottom: .3rem;
}

.text-card dl,
.text-card ol,
.text-card ul {
  list-style: none;
  margin-top: 0;
  padding-left: 0;
}

.text-card ul {
  list-style: circle inside;
}

.text-card ol {
  list-style: decimal inside;
}

/* TABLES */

.text-card table {
  border-collapse: collapse;
  width: 100%;
}

.text-card table td,
.text-card table th {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 8px;
}

.text-card table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.text-card table tr:hover {
  background-color: #ddd;
}

.text-card table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #aaa;
  color: white;
}
</style>
