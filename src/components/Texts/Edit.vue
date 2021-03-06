<template>
<v-container grid-list-md
             v-if="local_text">
  <v-layout row
            wrap>
    <v-flex xs12
            sm7
            v-if="!metadataOnly">
      <v-layout column>
        <v-flex xs12>
          <v-text-field v-if="userCanEdit"
                        v-model="local_text.title"
                        label="Titre"> </v-text-field>
          <v-toolbar v-if="!userCanEdit"
                     dense
                     flat
                     color="grey lighten-2">
            <v-toolbar-title class="subheading font-weight-light">{{local_text.title}}</v-toolbar-title>
          </v-toolbar>
        </v-flex>
        <v-flex xs12>
          <!-- Editing -->
          <markdown-editor v-if="userCanEdit"
                           v-model="local_text.content"
                           :configs="simpleMDEConfig"></markdown-editor>
          <!-- Viewing -->
          <div v-if="!userCanEdit"
               v-html="$options.filters.md(local_text.content)"
               class="text-card"> </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12
            :sm5="!metadataOnly">
      <v-layout column>
        <v-flex v-if="userCanEdit">
          <v-btn flat
                 color="primary"
                 :disabled="!local_text.content"
                 @click="saveText">{{ this.id ? "Modifier" : "Créer" }}</v-btn>
          <v-btn v-if="!metadataOnly"
                 flat
                 color="grey"
                 @click="$router.push('/')"> Annuler</v-btn>
          <v-btn flat
                 color="red"
                 v-if="id"
                 @click="removeText">Supprimer</v-btn>
        </v-flex>
        <v-flex>
          <v-card>
            <v-tabs center>
              <v-tab href="#tab-1"> Métadonnées </v-tab>
              <v-tab href="#tab-2"
                     v-if="userCanEdit"> Aperçu </v-tab>
              <v-tab href="#tab-3"> Modifications </v-tab>
              <!-- Métadonnées -->
              <v-tab-item id="tab-1">
                <v-card flat>
                  <v-card-text>
                    <v-layout column>
                      <!-- Author -->
                      <v-flex xs12>
                        <h1 class="subheading orange--text">Auteur</h1></v-flex>
                      <v-flex xs12>
                        <v-switch v-if="userCanEdit"
                                  label="Je suis l'auteur du texte"
                                  v-model="iAmAuthor"></v-switch>
                        <v-combobox v-if="!user || !iAmAuthor"
                                    label="Auteur"
                                    :items="authors"
                                    v-model="selectedAuthor"
                                    :item-text="i => i.name"
                                    :item-value="i => i.id"
                                    return-object
                                    dense
                                    :disabled="!userCanEdit"> </v-combobox>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Tags <v-icon @click="help('tags')" color="blue lighten-4" style="float:right">help</v-icon></h1> </v-flex>
                      <v-flex>
                        <!-- Tags -->
                        <v-layout column>
                          <v-flex xs12>
                            <tag-bar v-if="userCanEdit"
                                     v-model="local_text.tags"
                                     tag-only
                                     show-count
                                     dialog-button
                                     warning-less-than-two-tags
                                     :texts="texts"></tag-bar>
                          </v-flex>
                          <v-flex>
                            <chip-bar v-model="local_text.tags"
                                      :disabled="!userCanEdit"></chip-bar>
                          </v-flex>
                          <v-flex>
                            <v-alert :value="true"
                                     color="warning"
                                     v-if="local_text.tags.length < 2">
                              <v-icon @click="help('tags')"
                                      color="yellow darken-4"
                                      style="float:right">help</v-icon><b>Entre si possible au moins 2 tags.</b> Pour la plupart des textes, il faut remplir au minimum les catégories <code>Moment de culte</code> et <code>Occasion</code>.</v-alert>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex>
                        <h1 class="subheading orange--text">Autres</h1></v-flex>
                      <v-flex>
                        <v-text-field v-model="local_text.bible_ref"
                                      slot="activator"
                                      label="Texte(s) biblique(s)"
                                      append-icon="help"
                                      @click:append="help('bible')"
                                      class="help-icon"
                                      :disabled="!userCanEdit"></v-text-field>
                      </v-flex>
                      <v-flex>
                        <!-- Commentaires sur le texte -->
                        <v-checkbox label="Remarques et commentaires"
                                    append-icon="help"
                                    @click:append="help('comments')"
                                    class="help-icon"
                                    v-model="showComments"></v-checkbox>
                        <v-textarea v-if="showComments || local_text.comments"
                                    v-model="local_text.comments"
                                    auto-grow
                                    box
                                    rows="4"
                                    :disabled="!userCanEdit"></v-textarea>
                      </v-flex>
                      <v-flex>
                        <!-- Message aux admins -->
                        <v-checkbox label="Messages aux modérateurs"
                                    append-icon="help"
                                    @click:append="help('toAdmins')"
                                    class="help-icon"
                                    v-model="showToAdmins"></v-checkbox>
                        <v-textarea v-if="showToAdmins || local_text.toAdmins"
                                    v-model="local_text.toAdmins"
                                    auto-grow
                                    box
                                    rows="4"
                                    :disabled="!userCanEdit"></v-textarea>
                      </v-flex>
                      <!-- Licence -->
                      <v-flex>
                        <h1 class="subheading orange--text">Licence<v-icon @click="help('licence')" color="blue lighten-4" style="float:right">help</v-icon></h1></v-flex>
                      <v-flex>
                        <p class="body-1 grey--text">Je certifie que l'auteur du texte accepte la licence suivante:</p>
                        <v-select :disabled="!userCanEdit"
                                  :solo="userCanEdit"
                                  :items="licenceOptions"
                                  v-model="local_text.licence"></v-select>
                        <v-alert v-if="local_text.licence == ''"
                                 type="warning"
                                 :value="true">Dans ce cas, le texte sera enregistré mais signalé aux administrateurs pour vérifier la situation.</v-alert>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- Aperçu -->
              <v-tab-item id="tab-2"
                          v-if="userCanEdit">
                <text-card :text="local_text"></text-card>
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
import { snackbar, dialog, loader } from "@/utils"
import revisions from "@/components/Texts/Revisions/Revisions.vue"
import SimpleMDE from "simplemde"
export default {
  props: {
    "id": String,
    "metadataOnly": Boolean // Shows only metadata panel
  },
  components: {
    revisions
  },
  data() {
    return {
      // Text object props
      default_local_text: {
        title: "", // String
        content: "", // String
        bible_ref: "", // String
        comments: "", // String
        toAdmins: "",
        author: "", // ID (String)
        licence: "wl",
        created_on: "",
        created_by: "",
        edited_on: "",
        edited_by: "",
        tags: []
      },
      local_text: null,
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
      showToAdmins: false,
      licenceOptions: [{
        text: 'WikiLiturgie',
        value: 'wl'
      }, {
        text: 'Domaine public',
        value: 'dp'
      }, {
        text: 'Je ne sais pas',
        value: ''
      }, ]
    }
  },
  watch: {
    id() {
      this.loadText()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadText()
      this.$store.dispatch("components/arrowBackVisible", true)
    })
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      texts: "texts/texts",
      textById: "texts/textById",
      revisions: "texts/revisions",
      revisionById: "texts/revisionById",
      authors: "authors/authors",
      authorById: "authors/authorById",
      authorByUid: "authors/authorByUid",
      user: "users/user",
      userRole: "users/userRole",
      userCanEditText: "users/userCanEditText",
      userIsAuthenticated: "users/userIsAuthenticated",
      cartCountById: "texts/cartCountById"
    }),
    userCanEdit() {
      return this.userCanEditText(this.id)
    },
    iAmAuthor: {
      get: function () {
        if (!this.user) {
          return false
        } else if (this.userAuthor) {
          // User exists as author
          return this.local_text.author == this.userAuthor.id
        } else {
          // I don't exist as author
          return this.local_text.author == "me"
        }
      },
      set: function (val) {
        if (!this.user) { return } else if (val) {
          if (this.userAuthor) {
            // User is Author
            this.local_text.author = this.userAuthor.id
          } else {
            // User is not yet author
            this.local_text.author = "me"
          }
        } else {
          this.local_text.author = ""
        }
      }
    },
    userAuthor() {
      if (this.user && this.authors.some(a => a.user == this.user.id)) {
        return this.authorByUid(this.user.id)
      } else {
        return null
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
        if (this.local_text.author) {
          var author = this.authorById(this.local_text.author)
          if (author) {
            return author
          } else {
            return this.local_text.author
          }
        }
      },
      set: function (newVal) {
        // v-combobox replaces the object with the name of the object,
        // don't know why...
        var oldVal = this.selectedAuthor
        if (newVal && typeof (newVal) == "object") {
          this.local_text.author = newVal.id
        } else if (typeof (newVal) == "string" && typeof (oldVal) == "object" && oldVal.name == newVal) {
          // this.selectedAuthor = oldVal
          this.local_text.author = oldVal.id
        } else {
          this.local_text.author = newVal
        }
      }
    }
  },
  methods: {
    loadText() {
      this.local_text = Object.assign({}, this.default_local_text)
      if (this.id) {
        // Load values as a local copy
        var text = this.texts.find(t => t.id == this.id)
        if (text) {
          for (var k in text) this.$set(this.local_text, k, text[k])
          this.showComments = text.comments ? true : false
          this.showToAdmins = text.toAdmins ? true : false
        }
        // We bind revisions for the current text
        this.$store.dispatch("texts/bindRevisionsForText", this.id)
      }
    },
    validate() {
      // Memo: things to validate
      //
      // Création: anonym | user | modo
      // Édition / Suppression : user(own) | modo(all)
      // Licence WL: user | modo
      // To Admins: anonym(own) | user(all) | modo(all)
      // -----
      // Référence biblique
    },
    saveText() {
      // Prepare object
      var obj = {
        title: this.local_text.title,
        content: this.local_text.content,
        created_on: this.local_text.created_on,
        created_by: this.local_text.created_by,
        edited_on: firebase.firestore.FieldValue.serverTimestamp(),
        edited_by: this.user ? this.user.id : "",
        tags: this.local_text.tags,
        bible_ref: this.local_text.bible_ref,
        comments: this.local_text.comments,
        licence: this.local_text.licence,
        author: this.local_text.author,
        toAdmins: this.local_text.toAdmins
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
        obj.created_on = firebase.firestore.FieldValue.serverTimestamp()
        obj.created_by = this.user ? this.user.id : ""
        loader(true)
        db.collection("texts").add(obj).then(() => {
          snackbar("Le texte a été crée.")
          loader()
          this.$router.push("/")
        })
      } else {
        // Editing text, so we add a revisions
        var old_obj = this.copyOfCurrentText()
        loader(true)
        db.collection("texts").doc(this.id).collection("revisions").add(old_obj).then(
          () => db.collection("texts").doc(this.id).update(obj).then(
            () => {
              snackbar("Le texte a été mis à jour.")
              loader()
            }))
      }
      this.local_text.author = obj.author
    },
    removeText() {
      if (this.cartCountById(this.id)) {
        dialog({
          title: "Problème",
          text: `Ce texte est dans le panier de ` + this.cartCountById(this.id) + ` utilisateur(s).
                Tu ne peux pas le supprimer.`
        })
        return
      }
      this.confirmDialog = true
    },
    confirmRemoveText() {
      loader(true)
      // Remove revisions
      this.revisions.forEach(r => {
        db.collection("texts").doc(this.id).collection("revisions").doc(r.id).delete()
      })
      // Remove text
      db.collection("texts").doc(this.id).delete().then(() => {
        loader()
        snackbar("Le texte a bien été supprimé.")
        this.$router.push("/")
      })
    },
    createAuthor(name, isUser) {
      var authorRef = db.collection("authors").doc()
      var obj = {
        name: name,
        created_by: this.user ? this.user.id : "",
      }
      if (isUser) {
        obj.user = this.user.id
      }
      loader(true)
      authorRef.set(obj).then(() => {
        snackbar("L'auteur " + name + " a été crée.")
        loader()
      })
      return authorRef
    },
    copyOfCurrentText() {
      var text = this.textById(this.id)
      var obj = {}
      if (text) {
        for (var k in text) this.$set(obj, k, text[k])
      }
      return obj
    },
    restoreRevision(revId) {
      // 1. current text becomes a revisions
      // 2. current revision updates text
      var revision = this.revisionById(revId)
      revision.edited_on = firebase.firestore.FieldValue.serverTimestamp()
      var text = this.copyOfCurrentText()
      loader(true)
      db.collection("texts").doc(this.id).collection("revisions").add(text).then(
        () => db.collection("texts").doc(this.id).update(revision).then(
          () => db.collection("texts").doc(this.id).collection("revisions").doc(revision.id).delete().then(
            () => {
              loader()
              snackbar("Le texte a été restauré.")
              this.loadText()
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
      } else if (value == "licence") {
        dialog({
          title: "Licence WikiLiturgie",
          text: `
## À quoi ça sert?

Pour pouvoir être utilisé, le texte doit être placé sous la licence \`WikiLiturgie\`,
ou dans le \`domaine public\`. C'est ce qui permet aux utilisateurs d'adapter le texte
et de l'utiliser dans un culte sans être en violation du droit d'auteur.
Voir l'aide pour plus de détails.

## Quelle différence entre licence WikiLiturgie et domaine public?

Avec la licence WikiLiturgie, si ce texte est utilisé par quelqu'un, il devra
en **citer la source** — à part si c'est à l'oral, par exemple dans un culte.

Pour un texte dans le domaine public, il n'y a pas d'obligation de citer la source.

## Que faire si je ne suis pas l'auteur du texte ?

- Tu peux accepter la licence \`WikiLiturgie\` ou \`domaine public\` si l'auteur
du texte t'en a donné l'accord explicite.

- Tu peux indiquer \`domaine public\` si l'auteur est mort depuis plus de 70 ans
(le texte est déjà dans le domaine public). Attention: si le texte est une traduction,
alors il faut que le traducteur soit mort depuis plus de 70 ans.

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
