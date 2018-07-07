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
          class="mb-4" flat hover>
    <v-card-text>
      <p class="caption grey--text"> Le {{rev.created_on | date}} par {{users.find(u => u.id == rev.created_by).displayName}}</p>
      <revision :now="rev"
                :before="sortedRevisions[k+1]"></revision>
    </v-card-text>
  </v-card>
</v-flex>
</template>

<script>
import Vuex from "vuex"
import revision from "@/components/Texts/Revisions/Revision"
export default {
  props: ["revisions"],
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
  }
}
</script>
