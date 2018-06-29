<template>
<v-snackbar :timeout="2000"
            bottom
            v-model="visible"> {{ text }}
  <v-btn flat
         color="pink"
         @click.native="visible = false">Close</v-btn>
</v-snackbar>
</template>

<script>
import Vuex from "vuex"
export default {
  computed: { ...Vuex.mapGetters({
      text: "components/snackbar_text",
    }),
    visible: {
      get: function () {
        return this.$store.getters["components/snackbar"]
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
