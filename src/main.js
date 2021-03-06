import "@babel/polyfill"
import Vue from "vue"
import "./plugins/vuetify"
import App from "./App.vue"
import { store } from "./store"
import router from "./router"

Vue.config.productionTip = false

///// Filters
import { markdown, mdTOC } from "@/filters/markdown"
Vue.filter("md", markdown)
Vue.filter("mdTOC", mdTOC)
import DateFilter from "@/filters/date"
Vue.filter("date", DateFilter)
import DiffFilter from "@/filters/diff"
Vue.filter("diff", DiffFilter)
import ExcerptFilter from "@/filters/excerpt"
Vue.filter("excerpt", ExcerptFilter)

///// Components
import EditTextCmp from "./components/Texts/Edit.vue"
Vue.component("text-edit", EditTextCmp)
import TextsViewerCmp from "./components/Texts/Viewer.vue"
Vue.component("texts-viewer", TextsViewerCmp)
import TextsListCmp from "./components/Texts/List.vue"
Vue.component("texts-list", TextsListCmp)
import TextViewerCmp from "./components/Texts/SingleCard.vue"
Vue.component("text-card", TextViewerCmp)
import TextViewerTwoColCmp from "./components/Texts/SingleCardTwoCol.vue"
Vue.component("text-card-two-col", TextViewerTwoColCmp)
import ViewTagsCmp from "@/components/Tags/View"
Vue.component("view-tags", ViewTagsCmp)
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
import DialogCmp from "./components/Shared/Dialog.vue"
Vue.component("custom-dialog", DialogCmp)
import DataLoadingStatusCmp from "./components/Shared/DataLoadingStatus.vue"
Vue.component("data-loading-status", DataLoadingStatusCmp)
import DynamicContentCmp from "./components/Shared/DynamicContent.vue"
Vue.component("dynamic-content", DynamicContentCmp)
//////

//// SimpleMDE (Markdown editor)
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
Vue.use(VueSimplemde)

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
    this.$store.dispatch("users/setUsersRef", db.collection("users"))
    this.$store.dispatch("about/setDocsRef", db.collection("docs"))
    this.$store.dispatch("about/setBlogsRef", db.collection("blogs"))

    // Auth
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("users/autoSignIn", user)
      }
    })
  }
}).$mount("#app")