<template>
<v-flex xs12>
  <h1>Profile</h1>
  <p> User: {{ user}} </p>
  <v-btn @click="signOut">
    <v-icon>close</v-icon>Sign out</v-btn>
</v-flex>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user
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
      this.$store.dispatch("signOut")
    }
  }
}
</script>
