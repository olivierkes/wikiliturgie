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
                 v-if="item.children && breakpoint.xsOnly && !isEditing">
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
                              :to="'/doc/' + p.id"
                              :key="i"> {{ p.name }} </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-card>
    </v-flex>
    <!-- Menu -->
    <v-slide-y-transition>
      <v-flex xs12
              sm4
              v-if="showMenu && item.children || isEditing">
        <v-card>
          <v-toolbar color="grey darken-1"
                     dark
                     dense
                     height="32"
                     flat> <span>
                        Sous éléments
                      </span></v-toolbar>
          <v-list>
            <v-list-tile v-for="(c, i) in item.children"
                         :key="i"
                         :to="'/doc/' + child(c).id">
              <v-list-tile-title>{{child(c).name}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
          <v-card-text v-if="isEditing">
            <v-layout row
                      wrap>
              <v-flex xs12
                      sm9>
                <v-text-field label="Ajouter une rubrique"></v-text-field>
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
            <v-text-field label="Titre"></v-text-field>
            <v-textarea autoGrow
                        label="Contenu"></v-textarea>
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
export default {
  props: ["id"],
  data() {
    return {
      showMenu: true,
      isEditing: false,
    }
  },
  watch: {
    breakpoint() {
      // Breakpoint (screen size) changed
      this.showMenu = !this.breakpoint.xsOnly
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
    itemPath() {
      var parent = this.item
      var path = []
      while (parent) {
        path.push({
          name: parent.name,
          id: parent.id
        })
        parent = this.parent(parent.id)
      }
      return path.reverse()
    },
    rootItem() {
      // Returns the root item, ie the item whose id is in no "children"
      // props of any object
      var root = {}
      this.docs.forEach(doc => {
        var hasParent = false
        this.docs.forEach(d => {
          if (!hasParent && d.children && d.children.some(c => c == doc.id)) {
            hasParent = true
          }
        })
        if (!hasParent) { root = doc }
      })
      return root
    },
    breakpoint() {
      return this.$vuetify.breakpoint
    }
  },
  methods: {
    parent(parentId) {
      return this.docs.find(doc => doc.children && doc.children.some(c => c == parentId))
    },
    child(childId) {
      return this.docs.find(d => d.id == childId)
    },
    addNewDoc() {
      console.log("FIXME: ADD NEW DOC")
      this.isEditing = false
    },
    saveEdit() {
      console.log("FIXME: SAVE EDIT")
      this.isEditing = false
    },
    cancelEdit() {
      console.log("FIXME: CANCEL EDIT")
      this.isEditing = false
    },
    deleteDoc() {
      console.log("FIXME: DELETE DOC")
      // CANNOT DELETE IF CONTAINS SUB ITEMS
      this.$router.push("PARENT-ITEM")
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showMenu = !this.breakpoint.xsOnly
    })
  }
}
</script>
