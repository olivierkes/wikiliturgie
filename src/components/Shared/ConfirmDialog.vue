<template>
<v-dialog v-model="visible"
          persistent
          max-width="290">
  <v-card>
    <v-card-title class="headline">{{ msgTitle }}</v-card-title>
    <v-card-text>
      <slot> </slot>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1"
             flat
             @click.native="confirm">Oui</v-btn>
      <v-btn color="green darken-1"
             flat
             @click.native="cancel">Non</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    visible: Boolean
  },
  computed: {
    msgTitle() {
      return this.title || "Attention !"
    }
  },
  methods: {
    confirm() {
      this.$emit("update:visible", false)
      this.$emit('confirm')
    },
    cancel() {
      this.$emit("update:visible", false)
      this.$emit('cancel')
    }
  }
}
</script>
