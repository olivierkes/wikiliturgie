<template>
<v-flex>
  <v-text-field solo
                label="Filter les entrées"
                clearable
                v-model="filterText"
                append-icon="search"
                single-line
                hide-details></v-text-field>
  <v-data-table :headers="headers"
                :items="users"
                class="elevation-1"
                :search="filterText"> <template slot="items"
              slot-scope="props">
                  <td><v-avatar size="32"><img :src="props.item.photoURL" /></v-avatar></td>
                  <td>{{ props.item.displayName }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.role }}</td>
                  <td>{{ props.item.id }}</td>
   </template> </v-data-table>
</v-flex>
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
      }, {
        text: 'Nom',
        value: 'displayName'
      }, {
        text: 'Email',
        value: 'email'
      }, {
        text: "Rôle",
        value: "role"
      }, {
        text: "UID",
        value: "id"
      }, ],
      filterText: "",
    }
  },
  computed: { ...Vuex.mapGetters({
      users: "users/users"
    }),
  },
  methods: {
    filter(obj, txt) {
      console.log(obj)
    }
  }
}
</script>
