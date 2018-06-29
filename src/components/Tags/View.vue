<template>
<v-container grid-list-lg>
  <v-layout row
            wrap>
    <v-flex xs12
            sm6>
      <v-layout column>
        <v-flex>
          <h2>Groupes de tags</h2></v-flex>
        <v-flex>
          <v-card>
            <v-list two-line>
              <v-list-tile v-for="g in groups"
                           :key="g.id"
                           @click="currentGroupEdited = g.id">
                <v-list-tile-content>
                  <v-list-tile-title>{{g.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{g.description}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon
                         ripple
                         @click="editGroup(g.id)">
                    <v-icon color="grey lighten-1">edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-card-actions>
              <v-btn flat
                     color="orange"
                     @click="addGroup">Ajouter</v-btn>
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
                                v-model="groupName"
                                ref="tagName"
                                @keyup.enter="addOrEditGroup"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Description"
                                v-model="groupDescription"
                                @keyup.enter="addOrEditGroup"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-btn flat
                     :disabled="groupName == ''"
                     @click="addOrEditGroup">{{ isGroupEditing ? "Modifier" : "Ajouter" }}</v-btn>
              <v-btn flat
                     color="red"
                     v-if="isGroupEditing"
                     @click="removeGroupDialog">Supprimer</v-btn>
              <v-btn flat
                     @click="cancelEditGroup"
                     color="grey">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-flex>
    <v-flex xs12
            sm6>
      <tag-group-editor :groupId="currentGroupEdited"></tag-group-editor>
    </v-flex>
  </v-layout>
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
               @click.native="removeGroupConfirm">Oui</v-btn>
        <v-btn color="green darken-1"
               flat
               @click.native="removeGroupCancel">Non</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>


<script>
import { db } from '@/firebase'
import firebase from 'firebase/app'
import { snackbar } from "@/utils"
export default {
  data() {
    return {
      groupEdited: null, // to edit the group infos
      groupName: "",
      groupDescription: "",
      confirmDialog: false,
      confirmDialogAnswer: null,
      addOrEditDialog: false,
      currentGroupEdited: null, // in the group editor (reorganize tags)
    }
  },
  computed: {
    isGroupEditing() {
      if (this.groupEdited == null) { return false } else { return true }
    },
    groups() {
      return this.$store.getters["tags/tagGroups"]
    }
  },
  methods: {
    editGroup(id) {
      this.groupEdited = id
      var group = this.groups.find(e => e.id == id)
      this.groupName = group.name
      this.groupDescription = group.description
      this.addOrEditDialog = true
      this.$nextTick(function () { this.$refs.tagName.focus() })
    },
    addGroup() {
      this.addOrEditDialog = true
      this.$nextTick(function () { this.$refs.tagName.focus() })
    },
    cancelEditGroup() {
      this.groupEdited = null
      this.groupName = ""
      this.groupDescription = ""
      this.addOrEditDialog = false
    },
    addOrEditGroup() {
      if (this.groupEdited) {
        // We are editing
        db.collection("tagGroups").doc(this.groupEdited).update({
          name: this.groupName.trim(),
          description: this.groupDescription.trim()
        }).then(snackbar("Le groupe a été mis à jour."))
        this.cancelEditGroup()
      } else if (this.groupName !== "") {
        // We are creating a new group
        db.collection("tagGroups").add({
          name: this.groupName.trim(),
          description: this.groupDescription.trim(),
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(snackbar("Le groupe a bien été crée."))
        this.cancelEditGroup()
      }
    },
    removeGroupDialog() {
      this.confirmDialog = true
    },
    removeGroupConfirm() {
      this.confirmDialog = false
      db.collection("tagGroups").doc(this.groupEdited).delete().then(snackbar("Le groupe a bien été supprimé."))
      this.cancelEditGroup()
    },
    removeGroupCancel() {
      this.confirmDialog = false
    }
  }
}
</script>
