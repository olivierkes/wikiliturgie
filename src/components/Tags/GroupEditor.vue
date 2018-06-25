<template>
  <v-layout column v-if="groupId">
    <v-flex>
      <h2>Groupe: {{currentGroupName}}</h2></v-flex>
    <v-flex>
      <v-card>
        <v-list two-line>
          <v-list-tile v-for="t in groupTags"
                       :key="t.id"
                       @click="">
            <v-list-tile-content>
              <v-list-tile-title>{{t.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{t.description}}</v-list-tile-sub-title>
            </v-list-tile-content>
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
                 @click="addOrEditDialog = true">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="addOrEditDialog" max-width="600">
      <v-card>
        <v-container fluid
                     class="px-3">
          <v-layout row
                    wrap>
            <v-flex xs12>
              <v-text-field label="Nom"
                            required
                            v-model="tagName"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Description"
                            v-model="tagDescription"></v-text-field>
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
import { db } from '@/main'
import firebase from 'firebase/app'
export default {
  props: ["groupId"],

  data () {
    return {
      tags: [],
      groups: [],
      tagEdited: null,
      tagName: "",
      tagDescription: "",
      addOrEditDialog: false,
      confirmDialog: false
    }
  },

  computed: {
    group () {
      return this.groups.find(g => g.id == this.groupId)
    },
    groupTags () {
      if (this.group && this.tags && this.group.tags) {
        // return this.tags.filter(t => this.group.tags.find(id => id == t.id))
        var tags = []
        this.group.tags.forEach(tagID => {
          var tag = this.tags.find(t => t.id == tagID)
          if (tag) {tags.push(tag)}
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
    editTag(id) {
      this.tagEdited = id
      var tag = this.tags.find(t => t.id == id)
      this.tagName = tag.name
      this.tagDescription = tag.description
      this.addOrEditDialog = true
    },
    cancelEditTag() {
      this.tagEdited = null
      this.tagName = ""
      this.tagDescription = ""
      this.addOrEditDialog = false
    },
    addOrEditTag() {
      if (this.tagEdited) {
        // We are editing
        db.collection("tags").doc(this.tagEdited).update({
          name: this.tagName.trim(),
          description: this.tagDescription.trim()
        })
        this.cancelEditTag()
      } else if (this.tagName !== "") {
        // We are creating a new group
        var tagRef = db.collection("tags").doc()
        // db.collection("tags").add({
        tagRef.set({
          name: this.tagName.trim(),
          description: this.tagDescription.trim(),
          created: firebase.firestore.FieldValue.serverTimestamp()
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
      // Remove tag
      db.collection("tags").doc(this.tagEdited).delete()
      // Remove reference from group
      var tags = this.group.tags
      tags.splice(tags.indexOf(this.tagEdited), 1)
      db.collection("tagGroups").doc(this.groupId).update({tags: tags})

      this.cancelEditTag()
    },
    removeTagCancel() {
      this.confirmDialog = false
    }
  },

  firestore() {
    return {
      tags: db.collection("tags"),
      groups: db.collection("tagGroups")
    }
  },
}
</script>
