<template>
<v-container grid-list-md>
  <v-layout column>
    <v-flex xs12>
      <v-layout row>
        <v-flex xs7>
          <h1>Profile</h1> </v-flex>
        <v-flex xs5>
          <v-btn @click="signOut">
            <v-icon>close</v-icon>Sign out</v-btn>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-layout row
                  wrap>
          <v-flex xs12
                  sm6>
            <v-card>
              <v-card-text>
                <h3>Info</h3>
                <v-text-field label="Nom affiché"
                              v-model="userDisplayName"></v-text-field>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12
                  sm6>
            <v-card>
              <v-card-text>
                <h3>Debug</h3>
                <p> User: {{ user}} </p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data () {
    return {
      displayName: ""
    }
  },
  computed: {
    user() {
      return this.$store.getters["users/user"]
    },
    userDisplayName() {
      get: this.user.displayName
    }
  },
  watch: {
    user(value) {
      if (value == null) {
        this.$router.push("/")
      }
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch("users/signOut")
    }
  }
}
</script>
