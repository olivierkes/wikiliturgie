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
                      <v-flex xs12> {{ tempText.author }} {{selectedAuthor}}
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
                                     tag-only></tag-bar>
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
                        FIXME: {{ tempText.license_wl}}
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
        tags: null
      },
      // View props
      confirmDialog: false,
      selectedAuthor: "",
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
          return this.author == this.userAuthor.id
        } else {
          // I don't exist as author
          return this.author == "me"
        }
      },
      set: function (val) {
        if (!this.user) { return } else if (val) {
          if (this.userAuthor) {
            // User is Author
            this.author = this.userAuthor.id
          } else {
            // User is not yet author
            this.author = "me"
          }
        } else {
          this.author = ""
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
        if (this.id) {
          var text = this.texts.find(t => t.id == this.id)
          var obj = {}
          // for (var k in text) obj[k] = this.local_text[k] || text[k]
          for (var k in text) this.$set(this.local_text, k, this.local_text[k] || text[k])
          // return obj
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
    }
  },
  methods: {
    saveText() {},
    removeText() {},
    confirmRemoveText() {}
  },
  watch: {
    selectedAuthor: function (newVal, oldVal) {
      // v-combobox replaces the object with the name of the object,
      // don't know why...
      var authorID = ""
      if (newVal && typeof (newVal) == "object") {
        authorID = newVal.id
      } else if (typeof (newVal) == "string" && typeof (oldVal) == "object" && oldVal.name == newVal) {
        this.selectedAuthor = oldVal
        authorID = oldVal.id
      } else {
        authorID = newVal
      }
      this.author = authorID
    }
  },
  // mounted() {
  //   // FIXME: not reactive, because loaded only once in the view...
  //   // Find a way to use a computed property
  //   this.$nextTick(function () {
  //     if (this.id) {
  //       var text = this.texts.find(t => t.id == this.id)
  //       for (var k in text) this[k] = text[k]
  //     }
  //   })
  // }
}
</script>
