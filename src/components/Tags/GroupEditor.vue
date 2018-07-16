<template>
<v-layout column
          v-show="groupId">
  <v-flex>
    <v-card>
      <v-list dense
              ref="sortableList">
        <v-list-tile v-for="t in groupTags"
                     :key="t.id"
                     @click="">
          <v-list-tile-action>
            <v-btn style="cursor: move"
                   icon
                   class="sortHandle">
              <v-icon>drag_handle</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{t.name}} <span class="grey--text">({{numberOfTextsWithTags(t.id)}})</span></v-list-tile-title>
            <!-- <v-list-tile-sub-title>{{t.description}}</v-list-tile-sub-title> --></v-list-tile-content>
          <v-btn icon
                 v-if="t.description">
            <v-tooltip top>
              <v-icon color="grey lighten-1"
                      ripple
                      slot="activator">info</v-icon> <span>{{t.description}}</span> </v-tooltip>
          </v-btn>
          <v-list-tile-action>
            <v-btn icon
                   ripple
                   @click="editTag(t.id)">
              <v-icon color="grey lighten-1">edit</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-card-actions>
        <v-btn flat
               color="orange"
               @click="addTag">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
  <v-dialog v-model="addOrEditDialog"
            max-width="600">
    <v-card>
      <v-container fluid
                   class="px-3">
        <v-layout row
                  wrap>
          <v-flex xs12>
            <v-text-field label="Nom"
                          required
                          v-model="tagName"
                          @keyup.enter="addOrEditTag"
                          ref="tagName"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Description"
                          v-model="tagDescription"
                          @keyup.enter="addOrEditTag"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-btn flat
               :disabled="tagName == ''"
               @click="addOrEditTag">{{ isTagEditing ? "Modifier" : "Ajouter" }}</v-btn>
        <v-btn flat
               color="red"
               v-if="isTagEditing"
               @click="removeTagDialog">Supprimer</v-btn>
        <v-btn flat
               @click="cancelEditTag"
               color="grey">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="confirmDialog"
            persistent
            max-width="290">
    <v-card>
      <v-card-title class="headline">Tu es sur le point de supprimer un truc.</v-card-title>
      <v-card-text>Es-tu sûr de toi?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1"
               flat
               @click.native="removeTagConfirm">Oui</v-btn>
        <v-btn color="green darken-1"
               flat
               @click.native="removeTagCancel">Non</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</template>


<script>
import { db } from '@/firebase'
import firebase from 'firebase/app'
import Sortable from 'sortablejs'
import Vuex from "vuex"
import { snackbar, loader } from "@/utils"
export default {
  props: ["groupId"],
  data() {
    return {
      tagEdited: null,
      tagName: "",
      tagDescription: "",
      addOrEditDialog: false,
      confirmDialog: false,
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      groups: "tags/tagGroups",
      texts: "texts/texts"
    }),
    group() {
      return this.groups.find(g => g.id == this.groupId)
    },
    groupTags() {
      if (this.group && this.tags && this.group.tags) {
        // return this.tags.filter(t => this.group.tags.find(id => id == t.id))
        var tags = []
        this.group.tags.forEach(tagID => {
          var tag = this.tags.find(t => t.id == tagID)
          if (tag) { tags.push(tag) }
        })
        return tags
      } else {
        return []
      }
    },
    currentGroupName() {
      return this.group ? this.group.name : ""
    },
    isTagEditing() {
      if (this.tagEdited == null) { return false } else { return true }
    }
  },
  methods: {
    numberOfTextsWithTags(tagId) {
      // Returns the number of texts whose tagId is in tag
      return this.texts.filter(txt => txt.tags && txt.tags.some(t => t == tagId)).length
    },
    editTag(id) {
      this.tagEdited = id
      var tag = this.tags.find(t => t.id == id)
      this.tagName = tag.name
      this.tagDescription = tag.description
      this.addOrEditDialog = true
      this.$nextTick(function () { this.$refs.tagName.focus() })
    },
    cancelEditTag() {
      this.tagEdited = null
      this.tagName = ""
      this.tagDescription = ""
      this.addOrEditDialog = false
    },
    addTag() {
      this.addOrEditDialog = true
      this.$nextTick(function () { this.$refs.tagName.focus() })
    },
    addOrEditTag() {
      if (this.tagEdited) {
        // We are editing
        loader(true)
        db.collection("tags").doc(this.tagEdited).update({
          name: this.tagName.trim(),
          description: this.tagDescription.trim()
        }).then((data) => {
          loader()
          snackbar("Le tag a bien été modifié.")
        })
        this.cancelEditTag()
      } else if (this.tagName !== "") {
        // We are creating a new group
        var tagRef = db.collection("tags").doc()
        loader(true)
        tagRef.set({
          name: this.tagName.trim(),
          description: this.tagDescription.trim(),
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          loader()
          snackbar("Le tag a bien été crée.")
        })
        var tags = this.group.tags || []
        tags.push(tagRef.id)
        db.collection("tagGroups").doc(this.groupId).update({
          tags: tags
        })
        this.cancelEditTag()
      }
    },
    removeTagDialog() {
      this.confirmDialog = true
    },
    removeTagConfirm() {
      this.confirmDialog = false
      // FIXME: test if tag is empty (no texts attributed), or do something.
      if (this.numberOfTextsWithTags(this.tagEdited)){
        console.log("FIXME: tag is deleted, but there are texts attributed")
        snackbar("Le tag ne peux pas être supprimé, des textes lui sont attribués. (FIXME)")
        return
      }
      // Remove tag
      loader(true)
      db.collection("tags").doc(this.tagEdited).delete()
      // Remove reference from group
      var tags = this.group.tags
      tags.splice(tags.indexOf(this.tagEdited), 1)
      db.collection("tagGroups").doc(this.groupId).update({ tags: tags }).then((data) => {
        loader()
        snackbar("Le tag a bien été supprimé.")
      })
      this.cancelEditTag()
    },
    removeTagCancel() {
      this.confirmDialog = false
    },
    // Sortable
    dragReorder({ to, from, oldIndex, newIndex }) {
      const movedItem = this.group.tags.splice(oldIndex, 1)[0]
      this.group.tags.splice(newIndex, 0, movedItem)
      loader(true)
      db.collection("tagGroups").doc(this.groupId).update({ tags: this.group.tags }).then((data) => {
        loader()
        snackbar("Le nouvel ordre a été sauvé.")
      })
    }
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      var el = this.$refs.sortableList.$el
      var sortable = Sortable.create(el, {
        handle: '.sortHandle',
        onEnd: this.dragReorder
      })
    })
  }
}
</script>
