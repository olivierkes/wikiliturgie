<template>
<v-layout>
  <v-flex xs11>
    <v-tooltip v-for="chip in selected"
               bottom>
      <v-chip close
              small
              label
              :color="(chip.type == 'tag') ? 'grey lighten-1' : 'blue-grey lighten-3'"
              @input="remove(chip)"
              slot="activator"> {{chip.text}} </v-chip> <span> {{ chip.group }}</span> </v-tooltip>
  </v-flex>
  <v-flex xs1
          v-if="clearable && selected.length">
    <v-btn flat
           icon
           small
           @click="clear">
      <v-icon>clear</v-icon>
    </v-btn>
  </v-flex>
</v-layout>
</template>

<script>
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
    }
  },
  methods: {
    remove(item) {
      this.selected.splice(this.selected.indexOf(item), 1)
      this.selected = [...this.selected]
      this.$emit('input', this.selected)
    },
    clear() {
      this.selected = []
      this.$emit('input', this.selected)
    }
  }
}
</script>
