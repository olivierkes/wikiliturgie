<template>
<v-card class="mb-3"
        v-if="post">
  <router-link :to="'/blog/' + post.id">
    <v-card-media :src="post.imageUrl"
                  height="200px"> </v-card-media>
  </router-link>
  <v-tooltip top>
    <v-avatar color="white"
              style="float:right; top: -24px; left: -48px"
              slot="activator"> <img :src="avatar(post.created_by)" /> </v-avatar> <span>Crée par {{userById(post.created_by).displayName}} le {{post.created_on | date}}</span> </v-tooltip>
  <v-card-title primary-title>
    <div>
      <router-link :to="'/blog/' + post.id"
                   class="linkTitle">
        <h3 class="headline mb-0">{{post.title}}</h3> </router-link>
      <div class="caption grey--text">Crée par {{userById(post.created_by).displayName}} le {{post.created_on | date}}.</div>
    </div>
  </v-card-title>
  <v-card-text v-if="excerpt"
               v-html="$options.filters.md($options.filters.excerpt(post.content, excerptLength))"></v-card-text>
  <v-card-text v-if="!excerpt"
               v-html="$options.filters.md(post.content)"></v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn flat
           color="primary"
           v-if="excerpt && post.content.length > excerptLength"
           :to="'/blog/' + post.id">Lire la suite</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import Vuex from "vuex"
export default {
  props: {
    id: String,
    excerpt: Boolean,
    excerptLength: {
      type: Number,
      default: 800
    }
  },
  computed: { ...Vuex.mapGetters({
      blogs: "about/blogs",
      userIsAuthenticated: "users/isAuthenticated",
      avatar: "users/avatar",
      userById: "users/userById"
    }),
    post() {
      if (this.id && this.blogs) {
        return this.blogs.find(b => b.id == this.id)
      } else {
        return null
      }
    }
  }
}
</script>

<style>
.linkTitle,
.linkTitle:visited,
.linkTitle:link,
.linkTitle:active {
  text-decoration: none;
  color: black;
}
</style>
