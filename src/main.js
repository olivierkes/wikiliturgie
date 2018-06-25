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
const settings = { timestampsInSnapshots: true }
firebase.firestore().settings(settings)
firebase.firestore().enablePersistence()
  .then(function() {
    // Initialize Cloud Firestore through firebase
    console.log("Persistence: ok.")
  })
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.log("Debug: Persistence error: multiple tabs open, can only be enable in one.")
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.log("Debug: The current browser does not support persistence.")
    }
  })
export const db = firebase.firestore()
///////// Vuefire

///// Filters
import MarkdownFilter from "./filters/markdown"
Vue.filter("md", MarkdownFilter)
///// Components
import EditTextCmp from "./components/Texts/Edit.vue"
Vue.component("text-edit", EditTextCmp)
import TagBarCmp from "./components/Filters/TagBar.vue"
Vue.component("tag-bar", TagBarCmp)
import ChipBarCmp from "./components/Filters/ChipBar.vue"
Vue.component("chip-bar", ChipBarCmp)
import FilterDialogCmp from "./components/Filters/Dialog.vue"
Vue.component("filter-dialog", FilterDialogCmp)
import GroupEditorCmp from "./components/Tags/GroupEditor.vue"
Vue.component("tag-group-editor", GroupEditorCmp)
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