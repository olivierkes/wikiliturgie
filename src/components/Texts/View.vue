<template>
<v-container grid-list-lg
             v-if="text"
             fill-height>
  <v-layout row>
    <v-flex xs12
            md8>
      <v-text-field v-model="text.title"
                    single-line
                    @input="updateItem"> </v-text-field>
      <v-text-field v-model="escapedContent"
                    multi-line
                    rows="15"></v-text-field>
    </v-flex>
    <v-flex xs12
            md4>
      <v-btn flat
             color="primary">Enregistrer</v-btn>
      <v-btn flat
             color="grey">Annuler</v-btn>
      <v-card class="mb-2">
        <v-card-text>
          <h3>Aperçu</h3>
          <h4 v-if="text.title"
              class="primary--text">{{text.title}}</h4>
          <p v-html="$options.filters.md(text.content)"></p>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-text>
          <h3>Propriétés</h3> </v-card-text>
        <v-list>
          <v-list-tile v-if="text.created_on">Crée le: {{text.created_on}}</v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { db } from '@/main'
export default {
  props: ["id"],
  data() {
    return {
      text: null
    }
  },
  methods: {
    updateItem() {
      console.log(this.text)
      console.log(db.collection("texts"))
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
    }
  },
  firestore() {
    return {
      text: db.collection("texts").doc(this.id),
    }
  }
}
</script>
