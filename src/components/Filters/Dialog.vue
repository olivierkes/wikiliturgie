<template>
  <v-layout row justify-center>
      <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark dense color="primary">
            <v-btn icon dark @click.native="$emit('close')">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Filtres</v-toolbar-title>
          </v-toolbar>
          {{ value }}
        </v-card>
      </v-dialog>
    </v-layout>
</template>

<script>
export default {
  props: ["value", "show"],
  data () {
    return {
        notifications: false,
        sound: true,
        widgets: false
      }
  }
}

</script>
