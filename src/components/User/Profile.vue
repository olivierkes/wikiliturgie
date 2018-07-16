<template>
<v-container grid-list-lg>
  <v-layout column>
    <!-- <v-flex xs12> -->
    <!-- <v-layout row>
        <v-flex xs7>
          <h1>Profile</h1> </v-flex>
        <v-flex xs5>
          <v-btn @click="signOut"
                 flat
                 color="red">
            <v-icon>close</v-icon>Déconnection</v-btn>
        </v-flex>
      </v-layout> -->
    <v-flex xs12>
      <v-tabs color="primary"
              dark
              center
              fixed-tabs>
        <!-- Tabs -->
        <v-tab href="#info">
          <v-icon left>info</v-icon> &nbsp; Informations </v-tab>
        <v-tab href="#cart">
          <v-icon left>shopping_cart</v-icon> &nbsp;
          <v-badge color="green"><span slot="badge"
                  v-if="userCart.length">{{userCart.length}}</span>Panier</v-badge>
        </v-tab>
        <v-tab v-if="userRole == 'modo' || userRole == 'admin'"
               href="#modo">
          <v-icon left>build</v-icon> &nbsp;
          <v-badge color="red"><span slot="badge"
                  v-if="numberOfTextProblems">{{numberOfTextProblems}}</span>Modération</v-badge>
        </v-tab>
        <!-- Info -->
        <v-tab-item id="info">
          <v-container>
            <v-layout wrap>
              <v-flex xs12
                      sm6>
                <v-card>
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
                <v-btn @click="signOut"
                       flat
                       color="red">
                  <v-icon>close</v-icon>Déconnection</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
        <!-- Panier -->
        <v-tab-item id="cart">
          <v-container>
            <v-layout row
                      wrap>
              <v-flex xs12>
                <texts-viewer :texts="textsInUserCart"></texts-viewer>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
        <!-- Modération -->
        <v-tab-item id="modo">
          <v-tabs color="grey lighten-2"
                  center
                  fixed-tabs>
            <!-- Tabs -->
            <v-tab v-if="userRole == 'modo' || userRole == 'admin'"
                   href="#modoTexts">
              <v-icon left>list</v-icon> &nbsp; Textes </v-tab>
            <v-tab v-if="userRole == 'modo' || userRole == 'admin'"
                   href="#modoTags">
              <v-icon left>dns</v-icon> &nbsp; Tags </v-tab>
            <v-tab v-if="userRole == 'modo' || userRole == 'admin'"
                   href="#modoUsers">
              <v-icon left>supervised_user_circle</v-icon> &nbsp; Utilisateurs </v-tab>
            <!-- <v-container>
            <v-layout row
                      wrap>
              <v-flex xs12
                      sm6>
                <v-card>
                  <v-toolbar dense
                             color="grey"
                             dark>
                    <v-toolbar-title>Messages aux admins</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-list>
                      <v-list-tile v-for="txt in textsWithMessages"
                                   :key="txt.id"
                                   :to="'/text/' + txt.id">
                        <v-list-tile-avatar> <img :src="avatar(txt.created_by)"> </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{txt.toAdmins}}</v-list-tile-title>
                          <v-list-tile-sub-title>{{txt.title || txt.id}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container> -->
            <!-- Texts -->
            <v-tab-item id="modoTexts">
              <v-container>
                <v-layout row
                          wrap>
                  <v-flex xs11
                          sm10
                          offset-sm1>
                    <tag-bar v-model="filters"
                             include-authors
                             allows-custom-text
                             label="Rechercher..."
                             solo
                             show-count
                             :texts="searchedTexts"
                             hide-empty
                             dialog-button></tag-bar>
                    <chip-bar v-model="filters"
                              clearable></chip-bar>
                  </v-flex>
                  <v-flex xs1>
                    <v-btn flat
                           icon
                           :disabled="!listSelectedTextId"
                           @click.stop="listSelectedTextId=null">
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12
                          :sm5="listSelectedTextId">
                    <texts-list :texts="searchedTexts"
                                v-model="listSelectedTextId"></texts-list>
                  </v-flex>
                  <v-flex v-if="listSelectedTextId"
                          xs12
                          sm7>
                    <!-- <text-card :text="textById(listSelectedTextId)"></text-card> -->
                    <text-edit :id="listSelectedTextId"
                               metadata-only></text-edit>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
            <!-- Tags -->
            <v-tab-item id="modoTags">
              <view-tags></view-tags>
            </v-tab-item>
            <!-- Admin -->
            <v-tab-item id="modoUsers">
              <users></users>
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
      </v-tabs>
    </v-flex>
    <!-- </v-flex> -->
  </v-layout>
</v-container>
</template>

<script>
import { snackbar, filterTextsByIds, loader } from "@/utils"
import firebase from "firebase"
import Vuex from "vuex"
import { db } from "@/firebase"
import users from "@/components/User/Users.vue"
export default {
  data() {
    return {
      displayName: "",
      loaded: false,
      listSelectedTextId: null, // text id selected in table
      filters: [] // to filter texts
    }
  },
  components: {
    users
  },
  computed: { ...Vuex.mapGetters({
      authors: "authors/authors",
      user: "users/user",
      userRole: "users/userRole",
      texts: "texts/texts",
      numberOfTextProblems: "texts/numberOfTextProblems",
      textById: "texts/textById",
      userCart: "users/userCart",
      avatar: "users/avatar"
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
    },
    textsInUserCart() {
      return this.userCart.map(t => this.textById(t))
    },
    searchedTexts() {
      return filterTextsByIds(this.texts, this.filters)
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
      // FIXME: unique source of truth should be the `users` collection
      if (this.displayName) {
        loader(true)
        db.collection("users").doc(this.user.id).update({
          displayName: this.displayName
        }).then(() => {
          loader()
          snackbar("Bonjour " + this.displayName + ". Quel joli nom!")
        })
        // If user is a author, we need to update that too
        var author = this.authors.find(a => a.user == this.user.id)
        if (author) {
          loader(true)
          db.collection("authors").doc(author.id).update({ name: this.displayName }).then(() => {loader()})
        }
      } else {
        snackbar("Le nom ne peut pas être vide.")
      }
    }
  }
}
</script>
