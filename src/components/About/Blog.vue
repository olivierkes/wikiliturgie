<template>
<v-container grid-list-lg>
  <v-layout row
            wrap
            justify-center>
    <v-flex xs12
            sm9
            md8>
      <v-btn v-if="userIsAuthenticated && !id"
             dark
             fixed
             fab
             bottom
             right
             color="primary"
             to="/blog/add">
        <v-icon>add</v-icon>
      </v-btn>
      <div v-if="id">
        <!-- Single blog post -->
        <v-layout row
                  wrap>
          <v-flex xs12>
            <blog-post :id="id"></blog-post>
          </v-flex>
        </v-layout>
      </div>
      <div v-if="!id">
        <!-- List all blog posts -->
        <v-layout row
                  wrap>
          <v-flex xs12
                  v-for="post in sortedBlogPosts">
            <blog-post :id="post.id"
                       excerpt></blog-post>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import Vuex from "vuex"
import blogPost from "@/components/About/BlogPost.vue"
export default {
  props: ["id"],
  components: {
    blogPost
  },
  computed: { ...Vuex.mapGetters({
      blogs: "about/blogs",
      userIsAuthenticated: "users/isAuthenticated"
    }),
    sortedBlogPosts() {
      return this.blogs.slice().sort((a, b) => a.created_on < b.created_on)
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
