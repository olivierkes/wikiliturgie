<template>
<v-container grid-list-lg>
  <v-layout row
            wrap
            v-if="item"
            justify-center
            align-start>
    <v-flex xs12>
      <v-card>
        <!-- Toolbar -->
        <v-toolbar color="primary"
                   dark>
          <v-icon>help</v-icon>
          <v-toolbar-title> {{item.name}} </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon
                 @click.native="showMenu = ! showMenu"
                 v-if="false && children.length && breakpoint.xsOnly && !isEditing">
            <v-icon>menu</v-icon>
          </v-btn>
          <!-- Edit btn -->
          <v-btn v-if="userIsAuthenticated && !isEditing"
                 icon
                 @click="isEditing = true">
            <v-icon>edit</v-icon>
          </v-btn>
          <!-- Cancel btn -->
          <v-btn v-if="userIsAuthenticated && isEditing"
                 icon
                 @click="cancelEdit">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-actions>
          <!-- Breadcrumbs -->
          <v-breadcrumbs v-if="itemPath.length > 0">
            <v-icon slot="divider">forward</v-icon>
            <v-breadcrumbs-item v-for="(p, i) in itemPath"
                                :to="isEditing? '' : '/doc/' + p.id"
                                :key="i"> {{ p.name }} </v-breadcrumbs-item>
          </v-breadcrumbs>
          <v-icon v-if="children.length"
                  small
                  class="py-3"
                  style="margin-right: 12px;">forward</v-icon>
          <div v-if="children.length"
               v-for="(c, i) in sortByWeight(children)"
               :key="i"> <span v-if="i > 0"
                  class="mx-2">/</span>
            <router-link :to="isEditing? '' : '/doc/' + c.id"
                         style="text-decoration: none;">{{ c.name }}</router-link>
          </div>
          <v-menu v-if="children.length && false"
                  open-on-hover
                  bottom
                  offset-y> <a slot="activator"> Sous-éléments </a>
            <v-list dense>
              <v-list-tile v-for="(c, i) in sortByWeight(children)"
                           :key="i"
                           :to="isEditing? '' : '/doc/' + c.id">
                <v-list-tile-title>{{c.name}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-flex>
    <!-- Content -->
    <v-flex xs12
            sm8>
      <v-slide-x-transition>
        <!-- Display -->
        <v-card>
          <v-card-text v-if="!isEditing"
                       class="text-card">
            <div ref="content"></div>
            <dynamic-content :content="$options.filters.md(item.content)"></dynamic-content>
          </v-card-text>
        </v-card>
      </v-slide-x-transition>
      <v-slide-x-transition>
        <!-- Editing -->
        <v-card v-if="isEditing">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat
                   color="green"
                   @click.native="saveEdit">Enregistrer</v-btn>
            <v-btn flat
                   color="red"
                   @click.native="deleteDoc">Supprimer</v-btn>
            <v-btn flat
                   color="grey"
                   @click.native="cancelEdit">Annuler</v-btn>
          </v-card-actions>
          <v-card-text>
            <v-text-field label="Titre"
                          v-model="name"></v-text-field>
            <markdown-editor v-model="content"
                             :configs="simpleMDEConfig"></markdown-editor>
            <v-switch label="Montrer la table des matières?"
                      v-model="toc"></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat
                   color="green"
                   @click.native="saveEdit">Enregistrer</v-btn>
            <v-btn flat
                   color="red"
                   @click.native="deleteDoc">Supprimer</v-btn>
            <v-btn flat
                   color="grey"
                   @click.native="cancelEdit">Annuler</v-btn>
          </v-card-actions>
        </v-card>
      </v-slide-x-transition>
    </v-flex>
    <!-- Sidebar -->
    <v-flex xs12
            sm4>
      <v-slide-y-transition>
        <v-layout column
                  justify-start>
          <!-- Menu -->
          <v-slide-y-transition>
            <v-flex xs12
                    sm4
                    v-if="isEditing">
              <v-card>
                <v-toolbar color="grey darken-1"
                           dark
                           dense
                           height="32"
                           flat> <span>
                                Sous éléments
                              </span></v-toolbar>
                <div v-if="loadingChildrenOrder"
                     class="overlay">
                  <v-layout row
                            fill-height
                            align-center
                            justify-center>
                    <v-progress-circular indeterminate
                                         color="primary"></v-progress-circular>
                  </v-layout>
                </div>
                <v-list v-if="!loadingChildrenOrder">
                  <draggable v-model="children"
                             ref="sortableList"
                             :options="{handle:'.sortHandle'}">
                    <!-- @end="dragReorder" -->
                    <v-list-tile v-for="(c, i) in sortByWeight(children)"
                                 :key="i"
                                 :to="isEditing? '' : '/doc/' + c.id"
                                 :id="c.id">
                      <v-list-tile-action v-if="isEditing">
                        <v-btn style="cursor: move"
                               icon
                               class="sortHandle">
                          <v-icon>drag_handle</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                      <v-list-tile-title>{{c.name}}</v-list-tile-title>
                    </v-list-tile>
                  </draggable>
                </v-list>
                <v-card-text v-if="isEditing">
                  <v-layout row
                            wrap>
                    <v-flex xs12
                            sm12>
                      <v-text-field label="Ajouter une rubrique"
                                    v-model="newDocName"
                                    single-line
                                    append-outer-icon="add"
                                    @click:append-outer="addNewDoc"
                                    @keyup.enter="addNewDoc"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-slide-y-transition>
          <!-- Table of content -->
          <v-slide-y-transition>
            <v-flex xs12
                    sm4
                    v-if="isEditing && toc || !isEditing && item.toc">
              <v-card>
                <v-toolbar color="grey darken-1"
                           dark
                           dense
                           height="32"
                           flat> <span>
                        Table des matières
                      </span></v-toolbar>
                <v-card-text class="table-of-content">
                  <p v-for="(o, i) in mdTOC"> <a @click="scrollMeTo(o.slug)"
                       :class="'level-' + o.level">{{o.title}}</a> </p>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-slide-y-transition>
        </v-layout>
      </v-slide-y-transition>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import Vuex from "vuex"
import Vue from "vue"
import { db } from "@/firebase"
import { snackbar, loader } from "@/utils"
// import Sortable from 'sortablejs'
// var sortable
import draggable from 'vuedraggable'
var toc = require('markdown-toc')
export default {
  name: "Docasdad",
  props: ["id"],
  components: {
    draggable,
  },
  data() {
    return {
      showMenu: true,
      isEditing: false,
      newDocName: "",
      name: "",
      content: "",
      toc: false,
      loadingChildrenOrder: false,
      simpleMDEConfig: {
        tabSize: 8,
        spellChecker: false
      }
    }
  },
  watch: {
    breakpoint() {
      // Breakpoint (screen size) changed
      this.showMenu = !this.breakpoint.xsOnly
    },
    isEditing() {
      if (this.isEditing) {
        this.content = this.item.content
        this.name = this.item.name
        this.toc = this.item.toc || false
      }
    }
  },
  computed: { ...Vuex.mapGetters({
      docs: "about/docs",
      userIsAuthenticated: "users/userIsAuthenticated",
    }),
    item() {
      if (!this.id) {
        return this.rootItem
      } else {
        var match = this.docs.find(d => d.name.toLowerCase() == this.id.toLowerCase())
        if (match) {
          return match
        } else {
          return this.docs.find(d => d.id == this.id)
        }
      }
    },
    children: {
      get() {
        this.loadingChildrenOrder = false
        var children = this.docs.filter(doc => doc.parent == this.item.id)
        return children
      },
      set(val) {
        this.loadingChildrenOrder = true
        loader(true)
        db.runTransaction(transaction => {
          // This code may get re-run multiple times if there are conflicts.
          var p = Promise.resolve()
          return p.then(() => {
            val.forEach((doc, idx) => {
              transaction.update(db.collection("docs").doc(doc.id), { weight: idx })
            })
          })
        }).then(function () {
          loader()
          snackbar("L'ordre a bien été mis à jour.")
        }).catch(function (error) {
          loader()
          snackbar("Error ! Voir la console...")
          console.log("Transaction failed: ", error)
        })
      }
    },
    itemPath() {
      var item = this.item
      var path = []
      while (item) {
        path.push({
          name: item.name,
          id: item.id
        })
        item = this.parent(item)
      }
      return path.reverse()
    },
    rootItem() {
      // Returns the root item, ie the item whose id is in no "children"
      // props of any object
      return this.docs.find(doc => !doc.parent)
    },
    breakpoint() {
      return this.$vuetify.breakpoint
    },
    mdTOC() {
      if (!this.isEditing) {
        return this.$options.filters.mdTOC(this.item.content)
      } else {
        return this.$options.filters.mdTOC(this.content)
      }
    }
  },
  methods: {
    parent(item) {
      return this.docs.find(doc => doc.id == item.parent)
    },
    sortByWeight(arr) {
      return arr.sort((c1, c2) => c1.weight > c2.weight)
    },
    addNewDoc() {
      if (!this.newDocName) {
        snackbar("Le nom ne peut pas être vide")
        return
      }
      loader(true)
      db.collection("docs").add({
        parent: this.item.id,
        name: this.newDocName,
        content: "",
        weight: 100
      }).then(() => {
        loader()
        snackbar("Le document '" + this.newDocName + "' a été crée.")
      })
      this.newDocName = ""
      // this.isEditing = false
    },
    saveEdit() {
      if (!this.name) {
        snackbar("Le titre ne peut pas être vide, le pauve.")
        return
      } else {
        loader(true)
        db.collection("docs").doc(this.item.id).update({
          name: this.name,
          content: this.content,
          toc: this.toc
        }).then(() => {
          loader()
          snackbar("Enregistré!")
        })
      }
      this.isEditing = false
    },
    cancelEdit() {
      this.isEditing = false
    },
    deleteDoc() {
      if (!this.children.length && this.item.parent) {
        loader(true)
        db.collection("docs").doc(this.item.id).delete().then(() => {
          loader()
          snackbar("L'élément a été supprimé")
        })
        this.isEditing = false
        this.$router.push("/doc/" + this.item.parent)
      } else {
        snackbar("Tu ne peux pas supprimer un doc qui a des enfants. C'est cruel.")
      }
    },
    scrollMeTo(refName) {
      var element = document.getElementById(refName)
      var top = element.offsetTop
      window.scrollTo(0, top)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showMenu = !this.breakpoint.xsOnly
      this.$store.dispatch("components/arrowBackVisible", true)
    })
  }
}
</script>

<style scoped>
div.overlay {
  width: 100%;
  height: 100%;
  background: #ffffff !important;
  position: absolute;
  top: 0;
  z-index: 10;
}

.table-of-content p {
  margin-bottom: 10px
}

.table-of-content a.level-1 {
  padding-left: 0px
}

.table-of-content a.level-2 {
  padding-left: 15px
}

.table-of-content a.level-3 {
  padding-left: 30px
}

.table-of-content a.level-4 {
  padding-left: 45px
}

.table-of-content a.level-5 {
  padding-left: 60px
}

.table-of-content a.level-6 {
  padding-left: 75px
}
</style>
