<template>
<v-container>
  <v-layout row
            justify-center>
    <v-flex xs12
            sm6
            text-xs-center>
      <div>
        <v-btn block
               color="white"
               @click="authWithGoogle">Connexion via Google</v-btn>
      </div>
      <div>
        <v-btn block
               color="indigo"
               dark
               @click="authWithFacebook">Connexion via Facebook</v-btn>
      </div>
      <div>
        <v-btn block
               color="light-blue lighten-4">Connexion via Twitter</v-btn>
      </div>
      <div>
        <v-btn block
               color="black"
               dark>Connexion via Github</v-btn>
      </div>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/")
      }
    }
  },
  methods: {
    authWithGoogle() {
      this.$store.dispatch("signIn", { provider: new firebase.auth.GoogleAuthProvider() })
    },
    authWithFacebook() {
      this.$store.dispatch("signIn", { provider: new firebase.auth.FacebookAuthProvider() })
    },
  }
}
</script>
