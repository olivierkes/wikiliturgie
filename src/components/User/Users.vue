<template>
<v-container grid-list-lg>
  <v-layout column>
    <v-flex xs12>
      <h1>Gestion des utilisateurs</h1> </v-flex>
    <v-flex xs12>
      <v-data-table :headers="headers"
                    :items="users"
                    class="elevation-1"> <template slot="items"
                  slot-scope="props">
                  <td><v-avatar size="32"><img :src="props.item.photoURL" /></v-avatar></td>
                  <td>{{ props.item.displayName }}</td>
                  <td>{{ props.item.role }}</td>
                  <td>{{ props.item.id }}</td>

   </template> </v-data-table>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import Vuex from "vuex"
export default {
  data() {
    return {
      headers: [{
        text: '',
        value: 'photoURL',
        sortable: false
      },{
        text: 'Nom',
        value: 'displayName'
      }, {
        text: "Rôle",
        value: "role"
      },
      {
       text: "UID",
       value: "id"
     },
   ],
    }
  },
  computed: { ...Vuex.mapGetters({
      users: "users/users"
    }),
  }
}
</script>
