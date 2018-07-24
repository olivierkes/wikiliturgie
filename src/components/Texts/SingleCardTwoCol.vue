<template>
<v-card v-if="text"
        class="mb-2">
  <v-toolbar dense
             flat
             @click.stop="expanded = ! expanded">
    <v-toolbar-items v-if="isCardExpandable">
      <v-btn flat
             icon
             @click.stop="expanded = ! expanded">
        <v-icon>{{ expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-title>
      <h1 class="subheading font-weight-light">{{text.title}}</h1> </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <!-- Stars -->
      <v-btn flat
             icon
             v-if="!userIsAuthenticated && starCountById(text.id)"
             @click.stop>
        <v-tooltip top>
          <v-icon :color="starCountById(text.id) > 0 ? 'yellow' : 'grey'"
                  slot="activator">star </v-icon> <span>{{starCountById(text.id)}} étoile{{starCountById(text.id) > 1 ? "s":""}}</span> </v-tooltip>
      </v-btn>
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
        <v-tooltip top>
          <v-icon :color="textInCart? 'green' : 'grey'"
                  slot="activator">shopping_cart</v-icon> <span>Le texte est dans {{cartCountById(text.id)}} panier(s).</span> </v-tooltip>
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
          <v-avatar size="24"
                    slot="activator"> <img :src="avatar(text.created_by)" /> </v-avatar> <span>Crée par {{userById(text.created_by).displayName}} le {{text.created_on | date}}</span> </v-tooltip>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-divider></v-divider>
  <!-- CONTENT -->
  <v-card-text :style="style"
               ref="cardText"
               v-resize="updateCardHeight"
               class="text-card">
    <v-layout row
              wrap>
      <!-- Two column text -->
      <!-- <v-flex xs12
              :sm8="!isCardExpandable || expanded"
              :sm12="isCardExpandable && !expanded">
        <div v-html="$options.filters.md(text.content)"
        :class="(isCardExpandable && !expanded) ? 'two-col' : ''"></div>
      </v-flex> -->
      <v-flex xs12
              sm8>
        <div v-html="$options.filters.md(text.content)"></div>
      </v-flex>
      <!-- Metadata -->
      <v-flex xs12
              sm4
              :style="$vuetify.breakpoint.smAndUp ? 'border-left: 1px solid lightgrey' : ''">
        <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
        <v-layout row
                  wrap
                  v-for="(md, i) in metadata"
                  :key="i">
          <v-flex xs4
                  sm12
                  lg4
                  :class="'font-weight-medium caption grey--text ' + (!metadataTwoCols ? ' pb-0' : '')"> {{md.title}} </v-flex>
          <v-flex xs8
                  sm12
                  lg8
                  :class="'caption grey--text ' +  (!metadataTwoCols ? ' pt-0' : '')">{{ md.value }}</v-flex>
        </v-layout>
        <!-- Tags -->
        <v-layout v-if="text.tags.length"
                  row
                  wrap>
          <v-flex xs4
                  sm12
                  lg4
                  :class="'font-weight-medium caption grey--text ' + (!metadataTwoCols ? ' pb-0' : '')"> Tags </v-flex>
          <v-flex xs8
                  sm12
                  lg8
                  :class="'caption grey--text ' +  (!metadataTwoCols ? ' pt-0' : '')">
            <v-tooltip top
                       v-for="t in text.tags">
              <v-chip :key="t"
                      small
                      label
                      class="caption"
                      style="height: 18px; "
                      slot="activator"
                      color="grey lighten-3">{{tagById(t).name}}</v-chip> <span>{{groupByTagId(t).name}}</span></v-tooltip>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- <v-flex xs12
              class="pa-0">
        <v-tooltip top
                   v-for="t in text.tags">
          <v-chip :key="t"
                  small
                  label
                  slot="activator">{{tagById(t).name}}</v-chip> <span>{{groupByTagId(t).name}}</span></v-tooltip>
      </v-flex> --></v-layout>
  </v-card-text>
  <div v-if="isCardExpandable"
       @click="expanded = !expanded"
       :class="'card-overlay text-xs-center' + (expanded ? ' expanded' : '')"> <span class="display-1 font-weight-black">{{expanded ? "-" : "+"}}</span></div>
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
  },
  data() {
    return {
      cardHeight: 0,
      expanded: false
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
      starCountById: "texts/starCountById",
      cartCountById: "texts/cartCountById"
    }),
    style() {
      return {
        maxHeight: (!this.abstract || this.expanded) ? "" : this.abstractHeight + "px",
        overflowY: "hidden"
      }
    },
    abstractHeight() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 350
      } else {
        return 250
      }
    },
    isCardExpandable() {
      return this.cardHeight >= this.abstractHeight
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
      if (this.text.created_on) {
        md.push({
          title: "Crée le",
          value: this.$options.filters.date(this.text.created_on)
        })
      }
      return md
    },
    metadataTwoCols() {
      return this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.lgAndUp
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
  },
  updated() {
    this.updateCardHeight()
  },
  methods: {
    updateCardHeight() {
      this.cardHeight = this.$refs.cardText ? this.$refs.cardText.clientHeight : 0
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
}
</script>

<style>
.v-toolbar__items .v-tooltip {
  height: auto;
}

/* div.overlay {
  position: absolute;
  width: 100%;
  height: 16px;
  margin-top: -16px;
  background: linear-gradient(transparent, #0000003d);
} */

div.card-overlay {
  position: absolute;
  width: 100%;
  height: 64px;
  margin-top: -64px;
  z-index: 4;
  cursor: pointer;
}

.theme--light div.card-overlay {
  background: linear-gradient(#ffffff00, white);
}

.theme--dark div.card-overlay {
  background: linear-gradient(#42424200, #424242);
}

div.card-overlay.expanded {
  background: transparent;
}

div.card-overlay span {
  position: absolute;
  bottom: 1px;
}

.theme--light div.card-overlay span {
  color: white;
  text-shadow: 1px 1px 5px #0000004d;
}

.theme--light div.card-overlay:hover span {
  text-shadow: 1px 1px 8px #000000aa;
}

.theme--dark div.card-overlay span {
  color: #424242;
  text-shadow: 1px 1px 5px #ffffff6d;
}

.theme--dark div.card-overlay:hover span {
  text-shadow: 1px 1px 8px #ffffffaa;
}

div.two-col {
  column-count: 2;
  max-height: 250px;
  overflow: hidden;
  column-rule: 1px lightgrey solid;
  column-gap: 40px;
}
</style>
