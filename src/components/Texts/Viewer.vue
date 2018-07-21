<template>
<v-container fill-height
             pa-1
             grid-list-lg>
  <v-layout row
            wrap>
    <v-flex xs12
            sm8 offset-sm2
            v-for="(text, key) in texts"
            :key="key">
      <text-card-two-col :text="text" abstract></text-card-two-col>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  props: {
    texts: Array
  },
  data() {
    return {
      page: 1
    }
  },
  watch: {
    texts() { this.page = 1 }
  },
  created: function () {
    window.addEventListener('keyup', this.nextText)
  },
  methods: {
    nextText(event) {
      if (event.altKey || event.ctrlKey) { return }
      if (event.key == "ArrowRight") {
        this.page = Math.min(this.texts.length, this.page + 1)
      } else if (event.key == "ArrowLeft") {
        this.page = Math.max(1, this.page - 1)
      }
    }
  }
}
</script>
