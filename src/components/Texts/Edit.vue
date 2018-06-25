<template>
<v-container grid-list-lg
             fill-height
             v-if="text">
  <v-layout row
            wrap>
    <v-flex xs12
            sm8>
      <v-layout column>
        <v-flex xs12>
          <h1>Ajouter un texte</h1> </v-flex>
        <v-flex xs12>
          <v-text-field v-model="text.title"
                        single-line
                        label="Titre"
                        solo
                        @input="updateItem"> </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="escapedContent"
                        multi-line
                        label="Contenu"
                        solo
                        required
                        rows="15"></v-text-field>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12
            sm4>
      <v-flex>
        <v-btn flat
               color="primary"
               :disabled="!text.content">{{ saveBtnText }}</v-btn>
        <v-btn flat
               color="grey">Annuler</v-btn>
      </v-flex>
      <v-flex>
        <h3 class="subheading">Aperçu</h3> </v-flex>
      <v-flex>
        <v-card class="mb-2">
          <v-card-text>
            <h4 v-if="text.title"
                class="primary--text">{{text.title}}</h4>
            <p v-html="$options.filters.md(text.content)"></p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-text>
            <h3>Tags</h3> </v-card-text>

            <v-flex xs12>
              <tag-bar></tag-bar>
            </v-flex>
            <v-flex xs12>
              <chip-bar></chip-bar>
            </v-flex>
          <v-list>
            <v-list-tile v-if="text.created_on">Crée le: {{text.created_on}}</v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-text>
            <h3>Propriétés</h3> </v-card-text>
          <v-list>
            <v-list-tile v-if="text.created_on">Crée le: {{text.created_on}}</v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { db } from '@/firebase'
export default {
  props: ["id"],
  data() {
    return {
      texts: [],
      local_text: { title: "", content: "" }
    }
  },
  methods: {
    updateItem() {
      // console.log(this.text)
      // console.log(db.collection("texts"))
      // db.collection("texts").child(this.id).child('content').set(this.text.content)
      // db.collection("texts").child(this.id).child('title').set(this.text.title)
    }
  },
  computed: {
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
    saveBtnText() {
      return this.id ? "Modifier" : "Créer"
    }
  },
  firestore() {
    return {
      texts: db.collection("texts") //.doc(this.id)
    }
  }
}
</script>
