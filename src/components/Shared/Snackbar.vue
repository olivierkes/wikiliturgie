<template>
<v-snackbar :timeout="snackbar.timeout"
            :bottom="snackbar.bottom"
            :top="snackbar.top"
            :multi-line="snackbar.multiLine"
            :vertical="snackbar.multiLine"
            :color="snackbar.background"
            v-model="visible"> {{ snackbar.text }}
  <v-btn flat
         :color="snackbar.color"
         @click.native="visible = false">Close</v-btn>
</v-snackbar>
</template>

<script>
import Vuex from "vuex"
export default {
  computed: { ...Vuex.mapGetters({
      snackbar: "components/snackbar",
    }),
    visible: {
      get: function () {
        return this.$store.getters["components/snackbar_visible"]
      },
      set: function (val) {
        if (!val) {
          this.$store.dispatch("components/snackbar", "")
        }
      }
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
