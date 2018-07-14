<template>
<v-layout>
  <v-flex xs12>
    <v-btn v-if="clearable && selected.length"
           flat
           icon
           small
           @click="clear">
      <v-icon>clear</v-icon>
    </v-btn>
    <v-tooltip v-for="chip in computedChips"
               :key="chip.id"
               bottom>
      <v-chip close
              small
              label
              :color="chip.color"
              @input="remove(chip)"
              slot="activator"> {{chip.text}} </v-chip> <span> {{ chip.popup }}</span> </v-tooltip>
  </v-flex>
</v-layout>
</template>

<script>
import Vuex from "vuex"
export default {
  props: {
    "value": Array,
    "clearable": Boolean
  },
  data() {
    return {
      selected: this.value,
    }
  },
  watch: {
    value() {
      this.selected = this.value
    },
    selected() {
      this.$emit('input', this.selected)
    }
  },
  computed: { ...Vuex.mapGetters({
      isTag: "tags/isTag",
      tagById: "tags/tagById",
      groupByTagId: "tags/groupByTagId",
      isAuthor: "authors/isAuthor",
      authorById: "authors/authorById"
    }),
    computedChips() {
      var c = []
      this.selected.forEach(t => {
        if (this.isTag(t)) {
          // Tag
          c.push({
            text: this.tagById(t).name,
            color: "green lighten-4",
            popup: this.groupByTagId(t).name,
            id: this.tagById(t).id
          })
        } else if (this.isAuthor(t)) {
          // Author
          c.push({
            text: this.authorById(t).name,
            color: "purple lighten-4",
            popup: "Auteur",
            id: this.authorById(t).id
          })
        } else {
          c.push({
            text: t,
            color: "blue lighten-4",
            popup: "Texte personnalisé",
            id: t
          })
        }
      })
      return c
    }
  },
  methods: {
    remove(item) {
      this.selected = this.selected.filter(s => s !== item.id)
    },
    clear() {
      this.selected = []
    }
  }
}
</script>
