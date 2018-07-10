<template>
<v-container grid-list-lg>
  <v-layout row
            wrap
            v-if="item"
            justify-center>
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
                 v-if="children.length && breakpoint.xsOnly && !isEditing">
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
        <!-- Breadcrumbs -->
        <v-breadcrumbs v-if="itemPath.length > 1">
          <v-icon slot="divider">forward</v-icon>
          <v-breadcrumbs-item v-for="(p, i) in itemPath"
                              :to="isEditing? '' : '/doc/' + p.id"
                              :key="i"> {{ p.name }} </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-card>
    </v-flex>
    <!-- Menu -->
    <v-slide-y-transition>
      <v-flex xs12
              sm4
              v-if="showMenu && children.length || isEditing">
        <v-card>
          <v-toolbar color="grey darken-1"
                     dark
                     dense
                     height="32"
                     flat> <span>
                        Sous éléments
                      </span></v-toolbar>
          <v-list ref="sortableList">
            <v-list-tile v-for="(c, i) in children"
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
          </v-list>
          <v-card-text v-if="isEditing">
            <v-layout row
                      wrap>
              <v-flex xs12
                      sm9>
                <v-text-field label="Ajouter une rubrique"
                              v-model="newDocName"></v-text-field>
              </v-flex>
              <v-flex xs12
                      sm3>
                <v-btn :icon="breakpoint.smAndUp"
                       flat
                       color="green"
                       @click="addNewDoc">
                  <v-icon :left="breakpoint.xsOnly">add</v-icon> {{breakpoint.smAndUp ? "":"Ajouter"}} </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-slide-y-transition>
    <v-flex xs12
            sm8>
      <!-- Content -->
      <v-slide-x-transition>
        <v-card>
          <v-card-text v-if="!isEditing"
                       v-html="$options.filters.md(item.content)"> </v-card-text>
        </v-card>
      </v-slide-x-transition>
      <v-slide-x-transition>
        <v-card v-if="isEditing">
          <v-card-text>
            <v-text-field label="Titre"
                          v-model="name"></v-text-field>
            <v-textarea autoGrow
                        label="Contenu"
                        v-model="content"></v-textarea>
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
  </v-layout>
</v-container>
</template>

<script>
import Vuex from "vuex"
import Sortable from 'sortablejs'
import { db } from "@/firebase"
import { snackbar } from "@/utils"
var sortable
export default {
  props: ["id"],
  data() {
    return {
      showMenu: true,
      isEditing: false,
      newDocName: "",
      name: "",
      content: ""
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
      }
    }
  },
  computed: { ...Vuex.mapGetters({
      docs: "docs/docs",
      userIsAuthenticated: "users/isAuthenticated",
    }),
    item() {
      if (!this.id) {
        return this.rootItem
      } else {
        return this.docs.find(d => d.id == this.id)
      }
    },
    children() {
      var children = this.docs.filter(doc => doc.parent == this.item.id)
      console.log(children.map(c => c.name + ": " + c.weight).sort(c => c.weight))
      return children.sort(c => c.weight)
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
    }
  },
  methods: {
    parent(item) {
      return this.docs.find(doc => doc.id == item.parent)
    },
    addNewDoc() {
      if (!this.newDocName) {
        snackbar("Le nom ne peut pas être vide")
        return
      }
      db.collection("docs").add({
        parent: this.item.id,
        name: this.newDocName,
        content: "",
        weight: 100
      }).then(snackbar("Le document '" + this.newDocName + "' a été crée."))
      this.newDocName = ""
      // this.isEditing = false
    },
    saveEdit() {
      console.log("FIXME: SAVE EDIT")
      if (!this.name) {
        snackbar("Le titre ne peut pas être vide, le pauve.")
        return
      } else {
        db.collection("docs").doc(this.item.id).update({
          name: this.name,
          content: this.content
        }).then(() => {
          snackbar("Enregistré!")
        })
      }
      this.isEditing = false
    },
    cancelEdit() {
      console.log("FIXME: CANCEL EDIT")
      this.isEditing = false
    },
    deleteDoc() {
      console.log(this.item.parent)
      if (!this.children.length && this.item.parent) {
        db.collection("docs").doc(this.item.id).delete().then(() => {
          snackbar("L'élément a été supprimé")
        })
        this.isEditing = false
        this.$router.push("/doc/" + this.item.parent)
      } else {
        snackbar("Tu ne peux pas supprimer un doc qui a des enfants. C'est cruel.")
      }
    },
    // Sortable
    dragReorder({ to, from, oldIndex, newIndex }) {
      var order = []
      this.$refs.sortableList.$el.querySelectorAll("div.v-list__tile").forEach(item => order.push(item.getAttribute("id")))
      db.runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        var p = Promise.resolve()
        return p.then(() => {
          order.forEach((docId, idx) => {
            transaction.update(db.collection("docs").doc(docId), { weight: idx })
          })
        })
      }).then(function () {
        snackbar("L'ordre a bien été mis à jour.")
      }).catch(function (error) {
        snackbar("Error ! Voir la console...")
        console.log("Transaction failed: ", error)
      })
    },
    createSortable() {
      if (!this.children.length || !this.isEditing) {
        if (sortable) {sortable.destroy()}
      } else {
        var el = this.$refs.sortableList.$el
        sortable = Sortable.create(el, {
          handle: '.sortHandle',
          onEnd: this.dragReorder,
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showMenu = !this.breakpoint.xsOnly
    })
  },
  updated() {
    // After each dom modif
    this.$nextTick(() => {
      this.createSortable()
    })
  }
}
</script>
