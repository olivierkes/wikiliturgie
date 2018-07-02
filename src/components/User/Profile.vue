<template>
<v-container grid-list-lg>
  <v-layout column>
    <v-flex xs12>
      <v-layout row>
        <v-flex xs7>
          <h1>Profile</h1> </v-flex>
        <v-flex xs5>
          <v-btn @click="signOut">
            <v-icon>close</v-icon>Sign out</v-btn>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-layout row
                  wrap>
          <v-flex xs12
                  sm6>
            <v-card>
              <v-toolbar dense
                         flat
                         color="grey darken-1"
                         dark>
                <v-toolbar-title>Informations</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-text-field label="Nom d'auteur"
                              v-model="userDisplayName"
                              hint="Le nom d'auteur affiché pour cet utilisateur. Prénom + Nom."></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn flat
                       color="amber darken-4"
                       @click="saveDisplayName">Enregistrer</v-btn>
                <v-btn flat
                       color="grey"
                       @click="displayName=user.displayName">Annuler</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12
                  sm6>
            <v-card>
              <v-toolbar dense
                         flat
                         color="grey darken-1"
                         dark>
                <v-toolbar-title>Debug</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <p> User: {{ user}} </p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import {snackbar} from "@/utils"
import firebase from "firebase"
import Vuex from "vuex"
import { db } from "@/firebase"
export default {
  data() {
    return {
      displayName: "",
      loaded: false
    }
  },
  computed: {...Vuex.mapGetters({
      authors: "authors/authors",
      user: "users/user"
    }),
    userDisplayName: {
      get: function () {
        if (!this.loaded) {
          this.displayName = this.user.displayName
          this.loaded = true
        }
        return this.displayName
      },
      set: function (val) { this.displayName = val }
    }
  },
  watch: {
    user(value) {
      if (value == null) {
        this.$router.push("/")
      }
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch("users/signOut")
    },
    saveDisplayName() {
      if (this.displayName) {
        this.user.updateProfile({
          displayName: this.displayName
        }).then(() => snackbar("Bonjour " + this.displayName+". Quel joli nom!"))

        // If user is a author, we need to update that too
        var author = this.authors.find(a => a.user == this.user.uid)
        if (author) {
          db.collection("authors").doc(author.id).update({name: this.displayName})
        }
      } else {
        snackbar("Le nom ne peut pas être vide.")
      }
    }
  }
}
</script>
