<template>
<v-flex>
  <!-- <div v-for="(rev, k) in sortedRevisions"
       :key="rev.id">
    <p class="caption grey--text"> Le {{rev.created_on | date}} par {{users.find(u => u.id == rev.created_by).displayName}}</p>
    <p>
      <revision :now="rev"
                :before="sortedRevisions[k+1]"></revision>
    </p>
    <v-divider></v-divider>
  </div> -->
  <v-card v-for="(rev, k) in sortedRevisions"
          :key="rev.id"
          class="mb-4"
          flat
          hover>
    <v-card-text>
      <p class="caption grey--text"> <span>Le {{rev.created_on | date}} par {{users.find(u => u.id == rev.created_by).displayName}}</span> <span v-if="k == 0"> (version actuelle)</span> </p>
      <revision :now="rev"
                :before="sortedRevisions[k+1]"></revision>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon
             color="green--text"
             v-if="k != 0"
             small
             @click="$emit('restore-revision', rev.id)">
        <v-icon>restore</v-icon>
      </v-btn>
      <v-btn icon
             color="red--text"
             v-if="k != 0"
             small
             @click="removeRevision(rev)">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-flex>
</template>

<script>
import Vuex from "vuex"
import revision from "@/components/Texts/Revisions/Revision"
import { db } from "@/firebase"
import { snackbar } from "@/utils"
export default {
  props: ["revisions", "textId"],
  components: {
    revision
  },
  computed: { ...Vuex.mapGetters({
      users: "users/users"
    }),
    sortedRevisions() {
      if (this.revisions) {
        return this.revisions.slice().sort((a, b) => a.created_on < b.created_on)
      } else { return [] }
    }
  },
  methods: {
    removeRevision(rev) {
      var ref = db.collection("texts").doc(this.textId).collection("revisions").doc(rev.id)
      ref.delete().then(() => {
        snackbar("La modification a été supprimée de l'historique.")
      })
    }
  }
}
</script>
