<template>
<div style="height: 100%;">
  <h1>Locations</h1>
  <v-layout row>
    <v-flex v-for="(location, idx) in locations"
            :key="idx"
            xs4>
      <v-card>
        <v-card-media :src="location.image"
                      height="200"></v-card-media>
        <v-card-title primary-title>
          <h3>{{ location.name }}</h3></v-card-title>
        <v-card-actions>
          <v-btn flat
                 color="red"
                 @click="deleteLocation(location.id)">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs4>
      <v-card>
        <v-card-media :src="image"
                      :height="image? 200 : 0"></v-card-media>
        <v-card-title>
          <h3>New location</h3>
          <v-form>
            <v-text-field v-model="name"
                          placeholder="Location Name"></v-text-field>
            <v-text-field v-model="image"
                          placeholder="Location Image URL"></v-text-field>
          </v-form>
        </v-card-title>
        <v-card-actions>
          <v-btn flat
                 @click="addLocation(name, image)">Add New Location</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout column>
    <v-flex xs12
            v-show="searchText">
      <v-toolbar dense>
        <v-text-field prepend-icon="search"
                      full-width
                      hide-details
                      single-line
                      v-model="searchText"
                      ref="searchTop"
                      @change="focusText"></v-text-field>
        <v-toolbar-items>
          <v-btn flat
                 small>
            <v-icon>filter</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-flex>
    <v-layout align-center
              justify-center>
      <v-flex class="text-xs-center"
              v-show="!searchText"
              sm10
              md12>
        <v-text-field solo
                      class="mb-2"
                      v-model="searchText"
                      ref="searchCenter"
                      @change="focusText"></v-text-field>
        <v-btn class="mb-2">
          <v-icon left>search</v-icon> Rechercher</v-btn>
        <p class="body-1"> Parmis {{ nItems }} textes liturgiques. </p>
      </v-flex>
    </v-layout>
  </v-layout>
</div>
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
      nItems: 24982,
      searchText: null,
      locations: [],
      name: "",
      image: ""
    }
  },
  methods: {
    focusText() {
      if (this.searchText) {
        // document.getElementById("mytext").focus();
        this.$refs.searchTop.focus()
      } else {
        this.$refs.searchCenter.focus()
      }
    },
    addLocation(name, image) { // <-- and here
      const createdAt = new Date()
      db.collection('locations').add({ name, image, createdAt })
      console.log("Adds location" + name)
      this.name = ""
      this.image = ""
    },
    deleteLocation(id) {
      db.collection('locations').doc(id).delete()
    }
  },
  firestore() {
    return {
      locations: db.collection('locations').orderBy('createdAt')
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
