<template>
<v-container fill-height
             pa-1
             grid-list-lg>
  <v-layout v-if="!$vuetify.breakpoint.smAndDown"
            row
            wrap>
    <v-flex xs12
            sm8
            offset-sm2
            v-for="(text, key) in texts"
            :key="key">
      <text-card-two-col :text="text"
                         abstract></text-card-two-col>
    </v-flex>
  </v-layout>
  <v-layout v-if="$vuetify.breakpoint.smAndDown"
            row
            wrap>
    <v-pagination v-model="textNumber"
                  circle
                  :length="texts.length"></v-pagination>
    <v-flex xs12>
      <text-card-two-col :text="texts[textNumber-1]"
                         v-touch="swipe"></text-card-two-col>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  props: {
    texts: Array,
  },
  data() {
    return {
      textNumber: 1
    }
  },
  watch: {
    texts() { this.textNumber = 1 }
  },
  created: function () {
    window.addEventListener('keyup', this.nextText)
  },
  computed: {
    swipe() {
      return {
        left: () => this.textNumber = Math.min(this.texts.length, this.textNumber + 1),
        right: () => this.textNumber = Math.max(1, this.textNumber - 1)
      }
    }
  },
  methods: {
    nextText(event) {
      if (event.altKey || event.ctrlKey) { return }
      if (event.key == "ArrowRight") {
        this.textNumber = Math.min(this.texts.length, this.textNumber + 1)
      } else if (event.key == "ArrowLeft") {
        this.textNumber = Math.max(1, this.textNumber - 1)
      }
    }
  }
}
</script>
