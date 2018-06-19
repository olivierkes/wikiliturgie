import "@babel/polyfill"
import Vue from "vue"
import "./plugins/vuetify"
import App from "./App.vue"
import { store } from "./store"
import router from "./router"

Vue.config.productionTip = false

// Vuefire
var VueFire = require("vuefire")
var firebase = require("firebase")
// explicit installation required in module environments
Vue.use(VueFire)
var config = {
 apiKey: "AIzaSyAwWJFoCL8H2cnLXgJUIMEjNyEvm4i6z7A",
 authDomain: "wikiliturgie.firebaseapp.com",
 databaseURL: "https://wikiliturgie.firebaseio.com",
 projectId: "wikiliturgie",
 storageBucket: "wikiliturgie.appspot.com"
}
var firebaseApp = firebase.initializeApp(config)
var db = firebaseApp.database()
///////// Vuefire

new Vue({
 store,
 router,
 render: h => h(App)
}).$mount("#app")