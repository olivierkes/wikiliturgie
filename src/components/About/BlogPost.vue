<template>
<v-card class="mb-3"
        v-if="post || isEditing">
  <router-link :to="isEditing? '' : '/blog/' + post.id">
    <v-card-media :src="isEditing? local_imageUrl : post.imageUrl"
                  height="200px"> </v-card-media>
  </router-link>
  <v-tooltip top>
    <v-avatar color="white"
              style="float:right; top: -24px; left: -48px"
              slot="activator"> <img :src="avatar(post.created_by)" /> </v-avatar> <span>Crée par {{userById(post.created_by).displayName}} le {{post.created_on | date}}</span> </v-tooltip>
  <v-card-title primary-title>
    <div>
      <router-link v-if="!isEditing"
                   :to="'/blog/' + post.id"
                   class="linkTitle">
        <h3 class="headline mb-0">{{post.title}}</h3> </router-link>
      <v-text-field v-model="local_title"
                    label="Titre"
                    v-if="isEditing"></v-text-field>
      <div class="caption grey--text"
           v-if="!isEditing">Crée par {{userById(post.created_by).displayName}} le {{post.created_on | date}}.</div>
    </div>
  </v-card-title>
  <v-card-text v-if="excerpt && !isEditing"
               v-html="$options.filters.md($options.filters.excerpt(post.content, excerptLength))"></v-card-text>
  <v-card-text v-if="!excerpt && !isEditing"
               v-html="$options.filters.md(post.content)"></v-card-text>
  <v-card-text v-if="isEditing">
    <!-- <v-textarea v-model="local_content"
                label="Contenu"
                auto-grow></v-textarea> -->
    <markdown-editor v-model="local_content"
                     :configs="simpleMDEConfig"></markdown-editor>
    <v-text-field v-model="local_imageUrl"
                  label="URL de l'image"></v-text-field>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn flat
           color="primary"
           v-if="!isEditing && excerpt && post.content.length > excerptLength"
           :to="'/blog/' + post.id">Lire la suite</v-btn>
    <v-btn flat
           color="grey"
           v-if="isEditing"
           @click="cancel">Annuler</v-btn>
    <v-btn flat
           color="primary"
           v-if="userIsAuthenticated && !excerpt && !isEditing"
           @click="isEditing=!isEditing">Éditer</v-btn>
    <v-btn flat
           color="red"
           v-if="userIsAuthenticated && isEditing && !isNew"
           @click="remove">Supprimer</v-btn>
    <v-btn flat
           color="green"
           v-if="isEditing"
           @click="save">Enregistrer</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import Vuex from "vuex"
import { db } from "@/firebase"
import firebase from "firebase"
import { snackbar } from "@/utils"
export default {
  props: {
    id: String,
    excerpt: Boolean,
    excerptLength: {
      type: Number,
      default: 800
    }
  },
  data() {
    return {
      isEditing: false,
      local_title: "",
      local_content: "",
      local_imageUrl: "",
      simpleMDEConfig: {
        tabSize: 8,
        spellChecker: false
      }
    }
  },
  watch: {
    isEditing() {
      if (this.isEditing && this.id !== "add") {
        this.local_title = this.post.title
        this.local_content = this.post.content
        this.local_imageUrl = this.post.imageUrl
      }
    }
  },
  computed: { ...Vuex.mapGetters({
      blogs: "about/blogs",
      user: "users/user",
      userIsAuthenticated: "users/isAuthenticated",
      avatar: "users/avatar",
      userById: "users/userById"
    }),
    post() {
      var empty_obj = {
        title: this.local_title,
        content: this.local_content,
        created_on: "",
        created_by: this.user ? this.user.id : ""
      }
      if (this.id && this.blogs && !this.isNew) {
        var post = this.blogs.find(b => b.id == this.id)
        return post || empty_obj
      } else {
        return empty_obj
      }
    },
    isNew() {
      return this.id == "add"
    }
  },
  methods: {
    save() {
      if (!this.isNew) {
        db.collection("blogs").doc(this.id).update({
          title: this.local_title,
          content: this.local_content,
          imageUrl: this.local_imageUrl,
          updated_on: firebase.firestore.FieldValue.serverTimestamp(),
          updated_by: this.user ? this.user.id : "",
        }).then(() => {
          this.isEditing = false
          snackbar("Le post a été modifié.")
        })
      } else {
        var ref = db.collection("blogs").doc()
        ref.set({
          title: this.local_title,
          content: this.local_content,
          imageUrl: this.local_imageUrl,
          created_on: firebase.firestore.FieldValue.serverTimestamp(),
          created_by: this.user ? this.user.id : "",
        }).then(() => {
          this.isEditing = false
          this.$router.push("/blog/" + ref.id)
          snackbar("Le post a été crée.")
        })
      }
    },
    remove() {
      db.collection("blogs").doc(this.id).delete().then(() => {
        this.$router.push("/blog")
        this.isEditing = false
        snackbar("Le post a été supprimé.")
      })
    },
    cancel() {
      this.isEditing = false
      if (this.isNew) {
        this.$router.push("/blog")
      }
    }
  },
  updated() {
    if (this.id == "add") {
      this.isEditing = true
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
