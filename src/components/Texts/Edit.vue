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
              <v-tab href="#tab-2"> Tags </v-tab>
              <v-tab href="#tab-1"> Apperçu </v-tab>
              <v-tab href="#tab-3"> Propriétés </v-tab>
              <v-tab-item id="tab-1">
                <v-card flat>
                  <v-card-text>
                    <h4 v-if="text.title"
                        class="grey--text">{{text.title}}</h4>
                    <p v-html="$options.filters.md(text.content)"></p>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item id="tab-2">
                <v-card flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex xs12>
                        <tag-bar v-model="filters"
                                 :tags="organizedTags"></tag-bar>
                      </v-flex>
                      <v-flex>
                        <chip-bar v-model="filters"></chip-bar>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item id="tab-3">
                <v-card flat>
                  <v-card-text>
                    <v-list>
                      <v-list-tile v-if="text.created_on">Crée le: {{text.created_on}}</v-list-tile>
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
  <v-snackbar :timeout="2000"
              bottom
              v-model="snackbar"> {{ snackbarText }}
    <v-btn flat
           color="pink"
           @click.native="snackbar = false">Close</v-btn>
  </v-snackbar>
  <confirm-dialog :visible.sync="confirmDialog"
                  @confirm="confirmRemoveText">Tu es sur le point de supprimer un texte. Es-tu sûr de toi?</confirm-dialog>
</v-container>
</template>

<script>
import { db } from '@/firebase'
import Vuex from "vuex"
import firebase from 'firebase/app'
export default {
  props: ["id"],
  data() {
    return {
      local_text: { title: "", content: "" },
      filters: [],
      snackbar: false,
      snackbarText: "",
      confirmDialog: false,
    }
  },
  methods: {
    saveText() {
      var tags = this.filters.map(f => f.id)
      var obj = {
        title: this.text.title,
        content: this.text.content,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        tags: tags
      }
      if (!this.id) {
        // Creating text
        db.collection("texts").add(obj).then(() => {
          this.$router.push("/")
        })
      } else {
        // Editing text
        db.collection("texts").doc(this.id).update(obj)
      }
    },
    removeText() {
      this.confirmDialog = true
    },
    confirmRemoveText() {
      db.collection("texts").doc(this.id).delete().then(() => {
        this.$router.push("/")
      })
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      organizedTags: "tags/organizedTags",
      texts: "texts/texts"
    }),
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
