<template>
<v-container>
  <v-layout column>
    <v-flex xs12>
      <h1>Connection</h1> </v-flex>
    <v-flex xs12>
      <div id="firebaseui-auth-container"></div>
      <div id="loader" v-if="loading">Chargement...</div>

    </v-flex>
    <v-flex xs12>
      <v-alert type="warning" :value="true">FIXME: css import issue.</v-alert>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import firebase from "firebase"
import firebaseui from 'firebaseui'
import { ui } from "@/firebase"
//FIXME: CSS is not loaded properly??
require("@/../node_modules/firebaseui/dist/firebaseui.css")


export default {
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    user() {
      return this.$store.getters["users/user"]
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
    signInSuccessWithAuthResult(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      this.$store.dispatch("users/signIn", authResult)
      return false;
    },
  },
  mounted: function () {
    // Firebase UI (auth flow)
    // Initialize the FirebaseUI Widget using Firebase.
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
        uiShown: this.loading = false
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      // signInFlow: 'popup',
      // signInSuccessUrl: '/',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      // tosUrl: '<your-tos-url>'
    }
    this.$nextTick(function () {
      ui.start('#firebaseui-auth-container', uiConfig)
    })
  }
}
</script>
