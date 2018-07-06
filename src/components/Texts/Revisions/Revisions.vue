<template>
<v-list>
  <div v-for="rev in revisions"
       :key="rev.id">
    <v-list-tile>
      <v-list-tile-content>
        <v-list-tile-title>
          <p> {{rev}} </p>
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
  </div>
</v-list>
</template>

<script>
export default {
  props: ["revisions"]
}
</script>
