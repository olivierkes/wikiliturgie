<template>
<v-container grid-list-md>
  <v-layout row
            wrap>
    <v-flex xs12>
      <v-toolbar dense>
        <v-text-field prepend-icon="search"
                      full-width
                      hide-details
                      single-line
                      v-model="searchText"></v-text-field>
        <v-toolbar-items>
          <v-btn flat
                 small>
            <v-icon>filter</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-flex>
  </v-layout>
  <v-layout row
            wrap>
    <v-flex xs6
            sm4
            v-for="(text, key) in searchedTexts"
            :key="key">
      <v-card>
        <v-card-text>
          <h4 v-if="text.title">{{text.title}}</h4>
          <p> {{text.content}} </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>


<script>
import { db } from '../main'
export default {
  name: 'SearchBar',
  props: {
    msg: String
  },
  data() {
    return {
      searchText: null,
      image: "",
      texts: []
    }
  },
  computed: {
    searchedTexts() {
      if (this.searchText) {
        return this.texts.filter(txt => txt.content.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1)
      } else {
        return this.texts
      }
    }
  },
  firestore() {
    return {
      texts: db.collection("texts")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
