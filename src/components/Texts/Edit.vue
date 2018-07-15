<template>
<v-container grid-list-lg
             v-if="tempText">
  <v-layout row
            wrap>
    <v-flex xs12
            sm7>
      <v-layout column>
        <v-flex xs12>
          <h1>{{ this.id ? "Modifier un texte" : "Ajouter un texte"}}</h1> </v-flex>
        <v-flex xs12>
          <v-text-field v-model="tempText.title"
                        label="Titre"> </v-text-field>
        </v-flex>
        <v-flex xs12>
          <!-- <v-textarea v-model="tempText.content"
                      label="Contenu"
                      required
                      rows="25"></v-textarea> -->
          <markdown-editor v-model="tempText.content"
                           :configs="simpleMDEConfig"></markdown-editor>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12
            sm5>
      <v-layout column>
        <v-flex>
          <v-btn flat
                 color="primary"
                 :disabled="!tempText.content"
                 @click="saveText">{{ this.id ? "Modifier" : "Créer" }}</v-btn>
          <v-btn flat
                 color="grey"
                 @click="$router.push('/')">Annuler</v-btn>
          <v-btn flat
                 color="red"
                 v-if="id"
                 @click="removeText">Supprimer</v-btn>
        </v-flex>
        <v-flex>
          <v-card>
            <v-tabs center>
              <v-tab href="#tab-1"> Métadonnées </v-tab>
              <v-tab href="#tab-2"> Aperçu </v-tab>
              <v-tab href="#tab-3"> Modifications </v-tab>
              <!-- Métadonnées -->
              <v-tab-item id="tab-1">
                <v-card flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex xs12>
                        <h1 class="subheading orange--text">Auteur</h1></v-flex>
                      <v-flex xs12>
                        <v-switch v-if="user"
                                  label="Je suis l'auteur du texte"
                                  v-model="iAmAuthor"></v-switch>
                        <v-combobox v-if="!user || !iAmAuthor"
                                    label="Auteur"
                                    :items="authors"
                                    v-model="selectedAuthor"
                                    :item-text="i => i.name"
                                    :item-value="i => i.id"
                                    return-object
                                    dense> </v-combobox>
                        <!-- <v-alert :value="true"
                                 type="error"><b>Tu dois indiquer un auteur:</b> Toi, un auteur de la liste, ou en créer un nouveau en entrant son nom.<br /><br />Si l'auteur est inconnu, choisis <code>Inconnu / Anonyme</code>.</v-alert> --></v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Tags <v-icon @click="help('tags')" color="blue lighten-4" style="float:right">help</v-icon></h1> </v-flex>
                      <v-flex>
                        <v-layout column>
                          <v-flex xs12>
                            <tag-bar v-model="tempText.tags"
                                     tag-only
                                     show-count
                                     dialog-button
                                     warning-less-than-two-tags
                                     :texts="texts"></tag-bar>
                          </v-flex>
                          <v-flex>
                            <chip-bar v-model="tempText.tags"></chip-bar>
                          </v-flex>
                          <v-flex>
                            <v-alert :value="true"
                                     color="warning"
                                     v-if="local_text.tags.length < 2"><v-icon @click="help('tags')" color="yellow darken-4" style="float:right">help</v-icon><b>Entre si possible au moins 2 tags.</b> Pour la plupart des textes, il faut remplir au minimum les catégories <code>Moment de culte</code> et <code>Occasion</code>.</v-alert>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Autres</h1></v-flex>
                      <v-flex>
                        <v-text-field v-model="tempText.bible_ref"
                                      slot="activator"
                                      label="Texte(s) biblique(s)"
                                      append-icon="help"
                                      @click:append="help('bible')"
                                      class="help-icon"></v-text-field>
                      </v-flex>
                      <v-flex>
                        <!-- Commentaires sur le texte -->
                        <v-checkbox label="Remarques et commentaires"
                                    append-icon="help"
                                    @click:append="help('comments')"
                                    class="help-icon"
                                    v-model="showComments"></v-checkbox>
                        <v-textarea v-if="showComments || local_text.comments"
                                    v-model="tempText.comments"
                                    auto-grow box
                                    rows="4"></v-textarea>
                      </v-flex>
                      <v-flex>
                        <!-- Message aux admins -->
                        <v-checkbox label="Messages aux modérateurs"
                                    append-icon="help"
                                    @click:append="help('toAdmins')"
                                    class="help-icon"
                                    v-model="showToAdmins"></v-checkbox>
                        <v-textarea v-if="showToAdmins || local_text.toAdmins"
                                    v-model="tempText.toAdmins"
                                    auto-grow box
                                    rows="4"></v-textarea>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">License WikiLiturgie <v-icon @click="help('license')" color="blue lighten-4" style="float:right">help</v-icon></h1></v-flex>
                      <v-flex>
                        <p class="body-1 grey--text">Je certifie que l'auteur du texte accepte la licence WikiLiturgie:</p>
                        <v-switch :disabled="user==null"
                                  :label="tempText.license_wl? 'Oui': 'Non / je ne suis pas sûr'"
                                  v-model="tempText.license_wl"></v-switch>
                        <p class="body-1 grey--text"
                           v-if="!tempText.license_wl">Dans ce cas, le texte sera enregistré mais signalé aux administrateurs pour vérifier la situation.</p>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- Aperçu -->
              <v-tab-item id="tab-2">
                <text-card :text="tempText"></text-card>
              </v-tab-item>
              <!-- Révisions -->
              <v-tab-item id="tab-3">
                <!-- <v-card flat>
                  <v-card-text> -->
                <revisions :revisions="computedRevisions"
                           :text-id="id"
                           v-if="id"
                           @restore-revision="restoreRevision($event)"></revisions>
                <!-- </v-card-text>
                </v-card> -->
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  <confirm-dialog :visible.sync="confirmDialog"
                  @confirm="confirmRemoveText">Tu es sur le point de supprimer un texte. Es-tu sûr de toi?</confirm-dialog>
</v-container>
</template>

<script>
// FIXME: big problem. I'm changing this.text.xxx which creates a discrepancy
// between firebase and the local copy. I should only change local values.
import { db } from '@/firebase'
import Vuex from "vuex"
import firebase from 'firebase/app'
import { snackbar, dialog } from "@/utils"
import revisions from "@/components/Texts/Revisions/Revisions.vue"
import SimpleMDE from "simplemde"
export default {
  props: ["id"],
  components: {
    revisions
  },
  data() {
    return {
      // Text object props
      local_text: {
        title: "", // String
        content: "", // String
        bible_ref: "", // String
        comments: "", // String
        toAdmins: "",
        author: "", // ID (String)
        license_wl: true, // Boolean
        created_on: "",
        created_by: "",
        tags: []
      },
      // View props
      confirmDialog: false,
      synced: false, // used to perform sync only once
      simpleMDEConfig: {
        tabSize: 8,
        placeholder: 'Contenu du texte.',
        spellChecker: false,
        status: false,
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', "horizontal-rule", '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide']
      },
      showComments: false,
      showToAdmins: false
    }
  },
  mounted() {
    this.$nextTick(function () {
      // We bind revisions for the current text
      if (this.id) { this.$store.dispatch("texts/bindRevisionsForText", this.id) }
    })
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      texts: "texts/texts",
      revisions: "texts/revisions",
      authors: "authors/authors",
      authorById: "authors/authorById",
      authorByUid: "authors/authorByUid",
      user: "users/user",
      isAuthenticated: "users/isAuthenticated"
    }),
    iAmAuthor: {
      get: function () {
        if (!this.user) {
          return false
        } else if (this.userAuthor) {
          // User exists as author
          return this.tempText.author == this.userAuthor.id
        } else {
          // I don't exist as author
          return this.tempText.author == "me"
        }
      },
      set: function (val) {
        if (!this.user) { return } else if (val) {
          if (this.userAuthor) {
            // User is Author
            this.tempText.author = this.userAuthor.id
          } else {
            // User is not yet author
            this.tempText.author = "me"
          }
        } else {
          this.tempText.author = ""
        }
      }
    },
    userAuthor() {
      if (this.user && this.authors.some(a => a.user == this.user.uid)) {
        return this.authorByUid(this.user.uid)
      } else {
        return null
      }
    },
    tempText: {
      get: function () {
        if (this.id && !this.synced) {
          // Load values as a local copy
          var text = this.texts.find(t => t.id == this.id)
          if (text) {
            for (var k in text) this.$set(this.local_text, k, text[k])

            if (text.comments) { this.showComments = true }
            if (text.toAdmins) { this.showToAdmins = true }

            this.synced = true
          }
          // Return local text
          return this.local_text
        } else {
          return this.local_text
        }
      },
      set: function (val) {
        console.log("SETTING TEMP TEXT")
        console.log(val)
      }
    },
    computedRevisions() {
      // Adds the current text to revisions, to display it
      if (this.revisions && this.local_text) {
        var copy = this.copyOfCurrentText()
        return [copy].concat(this.revisions)
      }
    },
    selectedAuthor: {
      get: function () {
        if (this.tempText.author) {
          var author = this.authorById(this.tempText.author)
          if (author) {
            return author
          } else {
            return this.tempText.author
          }
        }
      },
      set: function (newVal) {
        // v-combobox replaces the object with the name of the object,
        // don't know why...
        var oldVal = this.selectedAuthor
        if (newVal && typeof (newVal) == "object") {
          this.tempText.author = newVal.id
        } else if (typeof (newVal) == "string" && typeof (oldVal) == "object" && oldVal.name == newVal) {
          // this.selectedAuthor = oldVal
          this.tempText.author = oldVal.id
        } else {
          this.tempText.author = newVal
        }
      }
    }
  },
  methods: {
    validate() {
      // Memo: things to validate
      //
      // Création: anonym | user | modo
      // Édition / Suppression : user(own) | modo(all)
      // License WL: user | modo
      // To Admins: anonym(own) | user(all) | modo(all)
      // -----
      // Référence biblique
    },
    saveText() {
      // Prepare object
      var obj = {
        title: this.tempText.title,
        content: this.tempText.content,
        created_on: firebase.firestore.FieldValue.serverTimestamp(),
        tags: this.tempText.tags,
        created_by: this.user ? this.user.uid : "",
        bible_ref: this.tempText.bible_ref || "",
        comments: this.tempText.comments || "",
        license_wl: this.tempText.license_wl || false,
        author: this.tempText.author || "",
        toAdmins: this.tempText.toAdmins || ""
      }
      if (obj.author == "me") {
        // We need to create an author for user
        var me = this.createAuthor(this.user.displayName, true)
        obj.author = me.id
      } else if (obj.author !== "") {
        // Check if author exsits
        var author = this.authors.find(a => a.id == obj.author)
        if (author) {
          // Author exists, everything alright, nothing to do
        } else {
          // Need to create author
          var authorRef = this.createAuthor(obj.author)
          obj.author = authorRef.id
        }
      } else {
        // Author is "", let's do nothing for now
      }
      // Saving object
      if (!this.id) {
        // Creating text
        db.collection("texts").add(obj).then(() => {
          snackbar("Le texte a été crée.")
          this.$router.push("/")
        })
      } else {
        // Editing text, so we add a revisions
        var old_obj = this.copyOfCurrentText()
        db.collection("texts").doc(this.id).collection("revisions").add(old_obj).then(
          () => db.collection("texts").doc(this.id).update(obj).then(
            () => snackbar("Le texte a été mis à jour.")))
      }
      this.tempText.author = obj.author
    },
    removeText() {
      this.confirmDialog = true
    },
    confirmRemoveText() {
      // Remove revisions
      this.revisions.forEach(r => {
        db.collection("texts").doc(this.id).collection("revisions").doc(r.id).delete()
      })
      // Remove text
      db.collection("texts").doc(this.id).delete().then(() => {
        snackbar("Le texte a bien été supprimé.")
        this.$router.push("/")
      })
    },
    createAuthor(name, isUser) {
      var authorRef = db.collection("authors").doc()
      var obj = {
        name: name,
        created_by: this.user ? this.user.uid : "",
      }
      if (isUser) {
        obj.user = this.user.uid
      }
      authorRef.set(obj).then(snackbar("L'auteur " + name + " a été crée."))
      return authorRef
    },
    copyOfCurrentText() {
      var text = this.texts.find(t => t.id == this.id)
      var obj = {}
      if (text) {
        for (var k in text) this.$set(obj, k, text[k])
      }
      return obj
    },
    restoreRevision(revId) {
      // 1. current text becomes a revisions
      // 2. current revision updates text
      var revision = this.revisions.find(r => r.id == revId)
      revision.created_on = firebase.firestore.FieldValue.serverTimestamp()
      var text = this.copyOfCurrentText()
      db.collection("texts").doc(this.id).collection("revisions").add(text).then(
        () => db.collection("texts").doc(this.id).update(revision).then(
          () => db.collection("texts").doc(this.id).collection("revisions").doc(revision.id).delete().then(
            () => {
              snackbar("Le texte a été restauré.")
              this.synced = false
            })))
    },
    help(value) {
      if (value == "comments") {
        dialog({
          title: "Champs « Remarques & Commentaires »",
          text: `
Commentaires à propos du texte:

- Son origine
- Sa référence exacte
- Des conseil pour son utilisations cutltuelle
- etc.

Tout ce qui peut être utile et informatif.`,
          titleColor: "green lighten-4",
        })
      } else if (value == "tags") {
        dialog({
          title: "Champs « Tags »",
          text: `
## À quoi ça sert?

Les tags sont le système de classement principal de WikiLiturgie.
**Un texte sans tags est un texte perdu**, qui ne sera jamais lu.
Il est donc *fortement recommandé* d'indiquer autant de tags que possible.

## Quels tags indiquer?

Pour la plupart des textes liturgiques, il faudra indiquer au moins:

- L'\`occasion\`
- Le \`moment de culte\`

Les tags indiqués doivent être significatifs. Par exemple, si un texte pourrait
être adapté à n'importe quel moment de l'année liturgique, on ne coche pas tous
les tags, mais on laisse tout vide.

Tu peux sélectionner les tags dans la liste, ou cliquer sur l'icône
<i aria-hidden="true" class="v-icon v-icon--link material-icons">settings</i>
pour sélectionner en fonction du groupe.

## Que faire si je ne trouve pas de tags pertinents, ou si je voudrais en créer?

Seuls les modérateurs peuvent créer des tags. Il est par contre *fortement recommandé*
d'indiquer dans la case \`Message aux modérateurs\` les tags manquants, ou même simplement
« Je ne sais pas comment classer ce texte », et les gentils modérateurs feront
le travail.
`,
          titleColor: "blue lighten-4",
        })
      } else if (value == "license") {
        dialog({
          title: "License WikiLiturgie",
          text: `
## À quoi ça sert?

Pour pouvoir être utilisé, le texte doit être placé sous la licence WikiLiturgie.
Elle permet aux utilisateurs d'adapter le texte et de l'utiliser dans un culte
sans être en violation du droit d'auteur. Voir l'aide pour plus de détails.

## Que faire si je ne suis pas l'auteur du texte ?

Vous pouvez accepter la license si:

- L'auteur du texte vous en a donné l'accord
- L'auteur est mort depuis plus de 70 ans (le texte est dans le domaine public)

## Que faire si je ne veux pas?

Si tu ne veux pas que ton texte soit utilisé par d'autres,
alors il vaut mieux ne pas le mettre ici.

## Et si je ne suis pas sûr?

Laisse la case sur \`Non / je ne suis pas sûr\` et les admins verront quoi
faire du texte.
`,
          titleColor: "blue lighten-4",
        })
      } else if (value == "toAdmins") {
        dialog({
          title: "Messages aux modérateurs",
          text: `
## À quoi ça sert?

Vous pouvez utiliser ce champ pour communiquer aux modérateurs du site.

Par exemple:

- «&nbsp;Je ne sais pas comment classer ce texte&nbsp;»
- «&nbsp;Il faudrait rajouter tel et tel tags&nbsp;»
- «&nbsp;Je pense que l'auteur n'a pas donné son accord pour que ce texte soit ici&nbsp;»
- «&nbsp;Je prétends être l'auteur de ce texte mais il ne m'est pas attribué&nbsp;»
- etc.

Les modérateurs seront signalés, et tâcheront de régler la situation au mieux.
Cela peut prendre quelques temps, merci d'être patient.

## Qui peut laisser un message?

Seuls les utilisateurs enregistrés peuvent laisser un message sur les textes existants.
En effet, il se peut que les modérateurs doivent contacter l'auteur du message, et il faut pour ceci
une adresse e-mail.

Un utilisateur anonyme peut laisser un message lors de la création d'un texte.
`,
          titleColor: "blue lighten-4",
        })
      } else if (value == "bible") {
        dialog({
          title: "Référence(s) bibliques",
          text: `
## À quoi ça sert?

Permet d'indiquer la / les références bibliques en lien avec le texte.

## Musique d'avenir

À l'avenir, WikiLiturgie sera capable de lire et gérer les références bibliques,
pour des recherches par exemple. Probablement grâce à [BCV Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser).

En attendant, merci d'écrire la / les références sans ambiguité, pour pouvoir
y revenir plus tard.
`,
          titleColor: "blue lighten-4",
        })
      }
    }
  }
}
</script>

<style>
.help-icon .v-input__icon .v-icon {
  color: #bbdefb;
}
</style>
