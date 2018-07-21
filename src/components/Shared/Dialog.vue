<template>
<v-dialog v-model="visible"
          :width="dialog.width">
  <v-card>
    <v-card-title :class="'headline ' + dialog.titleColor"> {{dialog.title}} </v-card-title>
    <v-card-text v-if="!dialog.markdown"> {{dialog.text}} </v-card-text>
    <v-card-text v-if="dialog.markdown"
                 v-html="$options.filters.md(dialog.text, false)"
                 class="text-card"></v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="isButtonVisible('ok')"
             color="primary"
             flat
             @click="ok"> OK </v-btn>
      <v-btn v-if="isButtonVisible('yes')"
             color="green"
             flat
             @click="ok"> Yes </v-btn>
      <v-btn v-if="isButtonVisible('no')"
             color="red"
             flat
             @click="ok"> No </v-btn>
      <v-btn v-if="isButtonVisible('cancel')"
             color="grey"
             flat
             @click="ok"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import Vuex from "vuex"
export default {
  computed: { ...Vuex.mapGetters({
      dialog: "components/dialog",
    }),
    visible: {
      get: function () {
        return this.$store.getters["components/dialog_visible"]
      },
      set: function (val) {
        if (!val) {
          this.$store.dispatch("components/dialog", "")
        }
      }
    }
  },
  methods: {
    isButtonVisible(name) {
      if (!this.dialog.buttons) { return false }
      return this.dialog.buttons.some(b => b == name)
    },
    ok() {
      this.visible = false
      this.$emit("ok")
    },
    confirm() {
      this.$emit("update:visible", false)
      // this.$emit('confirm')
    },
    cancel() {
      this.$emit("update:visible", false)
      // this.$emit('cancel')
    }
  }
}
</script>
