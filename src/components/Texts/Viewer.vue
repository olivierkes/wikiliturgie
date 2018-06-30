<template>
<div>
  <v-container v-if="singleMode"
               fill-height
               pa-1>
    <v-layout column
              align-center>
      <v-layout row>
        <v-flex xs12
                sm8
                offset-sm2
                md6
                offset-md3
                xl4
                offset-xl4>
          <text-card :text="texts[page-1]"></text-card>
        </v-flex>
      </v-layout>
      <v-flex>
        <v-pagination :length="texts.length"
                      v-model="page"></v-pagination>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container v-if="!singleMode"
               fill-height
               pa-1
               grid-list-lg>
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              md4
              xl3
              v-for="(text, key) in texts"
              :key="key">
        <text-card :text="text"
                   abstract></text-card>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
export default {
  props: {
    texts: Array,
    singleMode: Boolean
  },
  data() {
    return {
      page: 1
    }
  }
}
</script>
