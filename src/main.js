import "@babel/polyfill"
import Vue from "vue"
import "./plugins/vuetify"
import App from "./App.vue"
import { store } from "./store"
import router from "./router"

Vue.config.productionTip = false

///// Filters
import MarkdownFilter from "./filters/markdown"
Vue.filter("md", MarkdownFilter)
///// Components
import EditTextCmp from "./components/Texts/Edit.vue"
Vue.component("text-edit", EditTextCmp)
import TextsViewerCmp from "./components/Texts/Viewer.vue"
Vue.component("texts-viewer", TextsViewerCmp)
import TextViewerCmp from "./components/Texts/SingleCard.vue"
Vue.component("text-card", TextViewerCmp)
import TagBarCmp from "./components/Filters/TagBar.vue"
Vue.component("tag-bar", TagBarCmp)
import ChipBarCmp from "./components/Filters/ChipBar.vue"
Vue.component("chip-bar", ChipBarCmp)
import FilterDialogCmp from "./components/Filters/Dialog.vue"
Vue.component("filter-dialog", FilterDialogCmp)
import GroupEditorCmp from "./components/Tags/GroupEditor.vue"
Vue.component("tag-group-editor", GroupEditorCmp)
import ConfirmDialogCmp from "./components/Shared/ConfirmDialog.vue"
Vue.component("confirm-dialog", ConfirmDialogCmp)
import SnackBarCmp from "./components/Shared/Snackbar.vue"
Vue.component("snackbar", SnackBarCmp)
//////

import firebase from "firebase"
import { db } from '@/firebase'

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    // Firestore binding with VuexFire
    this.$store.dispatch("tags/setTagsRef", db.collection("tags"))
    this.$store.dispatch("tags/setTagGroupsRef", db.collection("tagGroups"))
    this.$store.dispatch("texts/setTextsRef", db.collection("texts"))
    this.$store.dispatch("authors/setAuthorsRef", db.collection("authors"))

    // Auth
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("users/autoSignIn", user)
      }
    })
  }
}).$mount("#app")