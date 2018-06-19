<template>
<div style="height: 100%;">
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
      <!-- <v-card > -->      <!-- <v-card > -->      <!-- <v-card > -->      <!-- <v-card > -->
<script>
export default {
  name: 'SearchBar',
  props: {
    msg: String
  },
  data() {
    return {
      nItems: 24982,
      searchText: null
    }
  },
  methods: {
    focusText (){
      if (this.searchText){
        // document.getElementById("mytext").focus();
        this.$refs.searchTop.focus()
      }
      else {
        this.$refs.searchCenter.focus()
      }
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
