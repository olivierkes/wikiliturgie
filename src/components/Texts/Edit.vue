<template>
<v-container grid-list-lg
             fill-height
             v-if="text">
  <v-layout row
            wrap>
    <v-flex xs12
            sm8>
      <v-text-field v-model="text.title"
                    single-line
                    @input="updateItem"> </v-text-field>
      <v-text-field v-model="escapedContent"
                    multi-line
                    rows="15"></v-text-field>
    </v-flex>
    <v-flex xs12
            sm4>
      <v-btn flat
             color="primary"
             :disabled="!text.content">{{ saveBtnText }}</v-btn>
      <v-btn flat
             color="grey">Annuler</v-btn>
      <h3 class="subheading">Aperçu</h3>
      <v-card class="mb-2">
        <v-card-text>
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
      fb_texts: null,
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
        var obj = this.fb_texts.find((obj) => {
          return obj.id === this.id
        })
        return obj
      } else {
        return this.local_text
      }
    },
    saveBtnText() {
      return this.id? "Modifier" : "Créer"
    }
  },
  firestore() {
    return {
      fb_texts: db.collection("texts") //.doc(this.id)
    }
  }
}
</script>
