<template>
  <div>
    <v-tooltip v-for="chip in selected" bottom>
      <v-chip close
              small
              label
              :color="(chip.type == 'tag') ? 'grey lighten-1' : 'blue-grey lighten-3'"
              @input="remove(chip)"
              slot="activator">
        {{chip.text}}
      </v-chip>
      <span> {{ chip.group }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      selected: this.value,
    }
  },
  methods: {
    remove(item) {
      this.selected.splice(this.selected.indexOf(item), 1)
      this.selected = [...this.selected]
      this.$emit('input', this.selected)
    }
  }
}
</script>
