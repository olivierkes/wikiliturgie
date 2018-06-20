import "@babel/polyfill"
import Vue from "vue"
import "./plugins/vuetify"
import App from "./App.vue"
import { store } from "./store"
import router from "./router"

Vue.config.productionTip = false

// Vuefire
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
// explicit installation required in module environments
Vue.use(VueFire)
var config = {
  apiKey: "AIzaSyAwWJFoCL8H2cnLXgJUIMEjNyEvm4i6z7A",
  authDomain: "wikiliturgie.firebaseapp.com",
  databaseURL: "https://wikiliturgie.firebaseio.com",
  projectId: "wikiliturgie",
  storageBucket: "wikiliturgie.appspot.com"
}
firebase.initializeApp(config) //var firebaseApp =
export const db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)
///////// Vuefire

///// filters
import MarkdownFilter from "./filters/markdown"
Vue.filter("md", MarkdownFilter)
//////

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("autoSignIn", user)
      }
    })
  }
}).$mount("#app")