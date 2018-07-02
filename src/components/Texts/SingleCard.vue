<template>
<!-- @mouseover="overflow = true" @mouseleave="overflow=false" -->
<v-card v-if="text"
        :hover="abstract && !overflow"
        @dblclick="overflow=!overflow"
        :flat="flat">
  <v-card-text :style="style">
    <!-- <p v-html="$options.filters.md(text.content.slice(0, 300))"></p> -->
    <h4 v-if="text.title"
        class="grey--text">{{text.title}}</h4>
    <p v-html="$options.filters.md(text.content)"></p>
    <p v-html="$options.filters.md(text.content)"></p>
    <p v-html="$options.filters.md(text.content)"></p>
    <p v-html="$options.filters.md(text.content)"></p>
  </v-card-text>
  <v-card-actions :class="(!abstract || overflow)? '':'elevation-2'">
    <v-btn v-if="abstract"
           icon
           @click.native="overflow = !overflow">
      <v-icon>{{ overflow ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-icon v-if="!userIsAuthenticated"
            :color="starCount > 0 ? 'yellow' : 'grey'">star </v-icon>
    <v-btn v-if="userIsAuthenticated"
           flat
           icon>
      <v-icon :color="userStarred ? 'yellow' : 'grey'"
              @click="toggleStar">star</v-icon>
    </v-btn>
    <p class="grey--text">{{ starCountDisplay }}</p>
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
      var uid = this.user.uid
      if (stars.some(s => s == uid)) {
        // Item is starred, we must destar
        stars = stars.filter(s => s !== uid)
      } else {
        // Item is not starred, we must star
        stars.push(uid)
      }
      // update Text object
      this.text.stars = stars
      console.log(this.text)
      db.collection("texts").doc(this.text.id).update(this.text)
    }
  },
  computed: { ...Vuex.mapGetters({
      user: "users/user",
      userIsAuthenticated: "users/isAuthenticated"
    }),
    style() {
      return {
        height: (!this.abstract || this.overflow) ? "" : "300px",
        overflowY: "hidden"
      }
    },
    starCount() {
      return this.text.stars ? this.text.stars.length : 0
    },
    starCountDisplay() {
      return this.starCount ? this.starCount : ""
    },
    userStarred() {
      if (!this.userIsAuthenticated) { return false }
      if (this.text.stars && this.text.stars.some(u => u == this.user.uid)) {
        return true
      }
      return false
    }
  }
}
</script>
