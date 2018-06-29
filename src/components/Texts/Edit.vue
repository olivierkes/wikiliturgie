<template>
<v-container grid-list-lg
             v-if="text">
  <v-layout row
            wrap>
    <v-flex xs12
            sm7>
      <v-layout column>
        <v-flex xs12>
          <h1>{{ this.id ? "Modifier un texte" : "Ajouter un texte"}}</h1> </v-flex>
        <v-flex xs12>
          <v-text-field v-model="text.title"
                        label="Titre"> </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="escapedContent"
                        multi-line
                        label="Contenu"
                        required
                        rows="25"></v-text-field>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12
            sm5>
      <v-layout column>
        <v-flex>
          <v-btn flat
                 color="primary"
                 :disabled="!text.content"
                 @click="saveText">{{ this.id ? "Modifier" : "Créer" }}</v-btn>
          <v-btn flat
                 color="grey"
                 @click="$router.push('/')">Annuler</v-btn>
          <v-btn flat
                 color="red"
                 v-if="id"
                 @click="removeText">Supprimer</v-btn>
        </v-flex>
        <v-flex>
          <v-card>
            <v-tabs center>
              <v-tab href="#tab-1"> Métadonnées </v-tab>
              <v-tab href="#tab-2"> Aperçu </v-tab>
              <v-tab href="#tab-3"> Révisions </v-tab>
              <!-- Métadonnées -->
              <v-tab-item id="tab-1">
                <v-card flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex xs12>
                        <h1 class="subheading orange--text">Auteur</h1></v-flex>
                      <v-flex xs12>
                        <v-switch v-if="user"
                                  label="Je suis l'auteur du texte"
                                  v-model="iAmAuthor"></v-switch>
                        <v-select v-if="!user || !iAmAuthor"
                                  combobox
                                  label="Auteur"
                                  :items="authors"
                                  v-model="authorObj"
                                  item-text="name"
                                  item-value="id"
                                  :search-input.sync="authorName"
                                  return-object
                                  dense></v-select>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Tags</h1></v-flex>
                      <v-flex>
                        <v-layout column>
                          <v-flex xs12>
                            <tag-bar v-model="filters"
                                     :tags="organizedTags"></tag-bar>
                          </v-flex>
                          <v-flex>
                            <chip-bar v-model="filters"></chip-bar>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Autres</h1></v-flex>
                      <v-flex>
                        <v-text-field v-model="text.bible_ref"
                                      slot="activator"
                                      label="Texte(s) biblique(s)"></v-text-field>
                      </v-flex>
                      <v-flex>
                        <v-text-field v-model="text.comments"
                                      label="Remarques générales"
                                      multi-line
                                      rows="4"></v-text-field>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">License WikiLiturgie</h1></v-flex>
                      <v-flex>
                        <p class="body-1 grey--text">Pour pouvoir être utilisé, le texte doit être placé sous la licence WikiLiturgie. Je certifie que l'auteur du texte l'accepte:</p>
                        <v-switch :disabled="user==null"
                                  :label="text.license_wl? 'Oui': 'Non / je ne suis pas sûr'"
                                  v-model="text.license_wl"></v-switch>
                        <p class="body-1 grey--text"
                           v-if="!text.license_wl">Dans ce cas, le texte sera enregistré mais signalé aux administrateurs pour vérifier la situation.</p>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- Aperçu -->
              <v-tab-item id="tab-2">
                <v-card flat>
                  <v-card-text>
                    <h4 v-if="text.title"
                        class="grey--text">{{text.title}}</h4>
                    <p v-html="$options.filters.md(text.content)"></p>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- Révisions -->
              <v-tab-item id="tab-3">
                <v-card flat>
                  <v-card-text>
                    <v-list>
                      <v-list-tile v-if="text.created">Crée le: {{text.created}}</v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  <confirm-dialog :visible.sync="confirmDialog"
                  @confirm="confirmRemoveText">Tu es sur le point de supprimer un texte. Es-tu sûr de toi?</confirm-dialog>
</v-container>
</template>

<script>
import { db } from '@/firebase'
import Vuex from "vuex"
import firebase from 'firebase/app'
import { snackbar } from "@/utils"
export default {
  props: ["id"],
  data() {
    return {
      local_text: {
        title: "",
        content: "",
        bible_ref: "",
        comments: "",
        author: "",
        license_wl: true
      },
      filters: [],
      confirmDialog: false,
      authorName: "",
    }
  },
  methods: {
    saveText() {
      var tags = this.filters.map(f => f.id)
      // Prepare object
      var obj = {
        title: this.text.title,
        content: this.text.content,
        created_on: firebase.firestore.FieldValue.serverTimestamp(),
        tags: tags,
        created_by: this.user ? this.user.uid : "",
        bible_ref: this.text.bible_ref || "",
        comments: this.text.comments || "",
        license_wl: this.text.license_wl || false,
        author: this.text.author || ""
      }
      // FIXME: all of this is ugly, plus it does'nt work
      // Cannot create new author, because authorName gets "" when out of
      // focus. Let's wait for vuetify 1.1.0 for combobox...
      var author = this.authors.find(a => a.id == this.text.author)
      if (this.text.author == "me") {
        // Finding me in authors
        var me = this.authors.find(a => a.user == this.user.uid)
        if (!me) {
          me = this.createAuthor(this.user.displayName, true)
        }
        obj.author = me.id
      } else if (author) {
        // && author.name == this.authorName
        // Double check, because we can have the old author selected
        // but a new text typed
        obj.author = this.text.author
      } else if (this.authorName) {
        // New name for author
        var authorRef = this.createAuthor(this.authorName)
        obj.author = authorRef.id
      } else {
        // Undefined author
        obj.author = ""
      }
      // Saving object
      if (!this.id) {
        // Creating text
        db.collection("texts").add(obj).then(() => {
          snackbar("Le texte a été crée.")
          this.$router.push("/")
        })
      } else {
        // Editing text
        db.collection("texts").doc(this.id).update(obj).then(snackbar("Le texte a été mis à jour."))
      }
    },
    removeText() {
      this.confirmDialog = true
    },
    confirmRemoveText() {
      db.collection("texts").doc(this.id).delete().then(() => {
        snackbar("Le texte a bien été supprimé.")
        this.$router.push("/")
      })
    },
    createAuthor(name, isUser) {
      var authorRef = db.collection("authors").doc()
      var obj = {
        name: name,
        created_by: this.user ? this.user.uid : "",
      }
      if (isUser) {
        obj.user = this.user.uid
      }
      authorRef.set(obj).then("L'auteur a été crée.")
      return authorRef
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      organizedTags: "tags/organizedTags",
      texts: "texts/texts",
      authors: "authors/authors"
    }),
    iAmAuthor: {
      get: function () {
        var author = this.authors.find(a => a.id == this.text.author)
        return this.user && author && author.user == this.user.uid || this.text.author == "me"
      },
      set: function (val) {
        this.text.author = val ? "me" : false
      }
    },
    authorObj: {
      get: function () {
        return this.authors.find(a => a.id == this.text.author)
      },
      set: function (obj) {
        if (typeof (obj) == "object") {
          this.text.author = obj.id
        }
      }
    },
    escapedContent: {
      get: function () {
        return this.text.content.split("\\n").join("\n")
      },
      set: function (val) {
        this.text.content = val
      }
    },
    text() {
      if (this.id) {
        var obj = this.texts.find((obj) => {
          return obj.id === this.id
        })
        return obj
      } else {
        return this.local_text
      }
    },
    user() {
      return this.$store.getters["users/user"]
    }
  },
  mounted() {
    // FIXME: not reactive, because loaded only once in the view...
    // Find a way to use a computed property
    this.$nextTick(function () {
      if (this.id) {
        var tags = this.text.tags
        var filters = []
        tags.forEach(tagId => {
          var tag = this.tags.find(t => t.id == tagId)
          var g = this.tagGroups.find(g => g.tags.some(t => t == tagId))
          filters.push({
            text: tag.name,
            group: g.name,
            groupId: g.id,
            type: "tag",
            id: tag.id
          })
        })
        this.filters = filters
      }
    })
  }
}
</script>
