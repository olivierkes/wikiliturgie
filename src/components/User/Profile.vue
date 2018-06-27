<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <h1>Profile</h1>
        <p> User: {{ user}} </p>
        <v-btn @click="signOut">
          <v-icon>close</v-icon>Sign out</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters["users/user"]
    }
  },
  watch: {
    user (value) {
      if (value == null) {
        this.$router.push("/")
      }
    }
  },
  methods: {
    signOut(){
      this.$store.dispatch("users/signOut")
    }
  }
}
</script>
