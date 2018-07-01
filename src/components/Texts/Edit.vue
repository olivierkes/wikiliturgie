<template>
<v-container grid-list-lg
             v-if="tempText">
  <v-layout row
            wrap>
    <v-flex xs12
            sm7>
      <v-layout column>
        <v-flex xs12>
          <h1>{{ this.id ? "Modifier un texte" : "Ajouter un texte"}}</h1> </v-flex>
        <v-flex xs12>
          <v-text-field v-model="tempText.title"
                        label="Titre"> </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-textarea v-model="escapedContent"
                      label="Contenu"
                      required
                      rows="25"></v-textarea>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12
            sm5>
      <v-layout column>
        <v-flex>
          <v-btn flat
                 color="primary"
                 :disabled="!tempText.content"
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
                        <v-combobox v-if="!user || !iAmAuthor"
                                    label="Auteur"
                                    :items="authors"
                                    v-model="selectedAuthor"
                                    :item-text="i => i.name"
                                    :item-value="i => i.id"
                                    return-object
                                    dense> </v-combobox>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Tags</h1></v-flex>
                      <v-flex>
                        <v-layout column>
                          <v-flex xs12>
                            <tag-bar v-model="tempText.tags"
                                     :tags="organizedTags"
                                     tag-only
                                     show-count
                                     :texts="texts"></tag-bar>
                          </v-flex>
                          <v-flex>
                            <chip-bar v-model="computedTags"></chip-bar>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Autres</h1></v-flex>
                      <v-flex>
                        <v-text-field v-model="tempText.bible_ref"
                                      slot="activator"
                                      label="Texte(s) biblique(s)"></v-text-field>
                      </v-flex>
                      <v-flex>
                        <v-textarea v-model="tempText.comments"
                                    label="Remarques générales"
                                    rows="4"></v-textarea>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">License WikiLiturgie</h1></v-flex>
                      <v-flex>
                        <p class="body-1 grey--text">Pour pouvoir être utilisé, le texte doit être placé sous la licence WikiLiturgie. Je certifie que l'auteur du texte l'accepte:</p>
                        <v-switch :disabled="user==null"
                                  :label="tempText.license_wl? 'Oui': 'Non / je ne suis pas sûr'"
                                  v-model="tempText.license_wl"></v-switch>
                        <p class="body-1 grey--text"
                           v-if="!tempText.license_wl">Dans ce cas, le texte sera enregistré mais signalé aux administrateurs pour vérifier la situation.</p>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- Aperçu -->
              <v-tab-item id="tab-2">
                <text-card :text="tempText"></text-card>
              </v-tab-item>
              <!-- Révisions -->
              <v-tab-item id="tab-3">
                <v-card flat>
                  <v-card-text>
                    <v-list>
                      <v-list-tile v-if="tempText.created_on">Crée le: {{tempText.created_on}}</v-list-tile>
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
// FIXME: big problem. I'm changing this.text.xxx which creates a discrepancy
// between firebase and the local copy. I should only change local values.
import { db } from '@/firebase'
import Vuex from "vuex"
import firebase from 'firebase/app'
import { snackbar } from "@/utils"
export default {
  props: ["id"],
  data() {
    return {
      // Text object props
      local_text: {
        title: "", // String
        content: "", // String
        bible_ref: "", // String
        comments: "", // String
        author: "", // ID (String)
        license_wl: true, // Boolean
        created_on: "",
        created_by: "",
        tags: []
      },
      // View props
      confirmDialog: false,
      synced: false // used to perform sync only once
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      organizedTags: "tags/organizedTags",
      tagObject: "tags/tagObject",
      texts: "texts/texts",
      authors: "authors/authors",
      user: "users/user"
    }),
    escapedContent: {
      get: function () {
        return this.tempText.content.split("\\n").join("\n")
      },
      set: function (val) {
        this.tempText.content = val
      }
    },
    iAmAuthor: {
      get: function () {
        if (!this.user) {
          return false
        } else if (this.userAuthor) {
          // User exists as author
          return this.tempText.author == this.userAuthor.id
        } else {
          // I don't exist as author
          return this.tempText.author == "me"
        }
      },
      set: function (val) {
        if (!this.user) { return } else if (val) {
          if (this.userAuthor) {
            // User is Author
            this.tempText.author = this.userAuthor.id
          } else {
            // User is not yet author
            this.tempText.author = "me"
          }
        } else {
          this.tempText.author = ""
        }
      }
    },
    userAuthor() {
      if (this.user && this.authors.some(a => a.user == this.user.uid)) {
        return this.authors.find(a => a.user == this.user.uid)
      } else {
        return null
      }
    },
    tempText: {
      get: function () {
        if (this.id && !this.synced) {
          var text = this.texts.find(t => t.id == this.id)
          if (text) {
            for (var k in text) this.$set(this.local_text, k, this.local_text[k] || text[k])
            this.synced = true
          }
          return this.local_text
        } else {
          return this.local_text
        }
      },
      set: function (val) {
        console.log("SETTING TEMP TEXT")
        console.log(val)
      }
    },
    computedTags: {
      get: function () {
        if (this.tempText.tags) {
          return this.tempText.tags.map(tagId => this.tagObject(tagId))
        } else {
          return []
        }
      },
      set: function (val) {
        this.tempText.tags = val.map(t => t.id)
      }
    },
    selectedAuthor: {
      get: function () {
        if (this.tempText.author) {
          var author = this.authors.find(a => a.id == this.tempText.author)
          if (author) {
            return author
          } else {
            return this.tempText.author
          }
        }
      },
      set: function (newVal) {
        // v-combobox replaces the object with the name of the object,
        // don't know why...
        var oldVal = this.selectedAuthor
        var authorID = ""
        if (newVal && typeof (newVal) == "object") {
          this.tempText.author = newVal.id
        } else if (typeof (newVal) == "string" && typeof (oldVal) == "object" && oldVal.name == newVal) {
          // this.selectedAuthor = oldVal
          // authorID = oldVal.id
          this.tempText.author = oldVal.id
        } else {
          this.tempText.author = newVal
        }
      }
    }
  },
  methods: {
    saveText() {
      // Prepare object
      var obj = {
        title: this.tempText.title,
        content: this.tempText.content,
        created_on: firebase.firestore.FieldValue.serverTimestamp(),
        tags: this.tempText.tags,
        created_by: this.user ? this.user.uid : "",
        bible_ref: this.tempText.bible_ref || "",
        comments: this.tempText.comments || "",
        license_wl: this.tempText.license_wl || false,
        author: this.tempText.author || ""
      }
      if (obj.author == "me") {
        // We need to create an author for user
        me = this.createAuthor(this.user.displayName, true)
        obj.author = me.id
      } else if (obj.author !== "") {
        // Check if author exsits
        var author = this.authors.find(a => a.id == obj.author)
        if (author) {
          // Author exists, everything alright, nothing to do
        } else {
          // Need to create author
          var authorRef = this.createAuthor(obj.author)
          obj.author = authorRef.id
        }
      } else {
        // Author is "", let's do nothing for now
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
      this.tempText.author = obj.author
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
      authorRef.set(obj).then(snackbar("L'auteur " + name + " a été crée."))
      return authorRef
    }
  }
}
</script>
