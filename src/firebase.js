import Vue from "vue"
import firebase from 'firebase/app'
import 'firebase/firestore'
// import firebase from "firebase"
import firebaseui from 'firebaseui'

// explicit installation required in module environments
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

// FirebaseUI auth flow
export const ui = new firebaseui.auth.AuthUI(firebase.auth())