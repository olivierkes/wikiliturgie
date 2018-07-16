<template>
<v-data-table :headers="headers"
              :items="texts"
              class="elevation-1"> <template slot="items"
            slot-scope="props">
                    <tr @click="select(props.item.id)"
                        :class="itemClasses(props.item.id)">
                      <td>{{ props.item.title || props.item.content | excerpt(40) }}</td>
                      <td class="text-xs-center">
                          <v-tooltip top>
                            <v-avatar size="32" slot="activator">
                              <img :src="avatar(props.item.created_by)" />
                              </v-avatar>
                            <span>{{userById(props.item.created_by).displayName || "Anonyme"}}</span>
                          </v-tooltip></td>
                        <td>{{ authorNameById(props.item.author) }}</td>
                        <td class="text-xs-center">{{ props.item.tags.length }}</td>
                        <td class="text-xs-center">
                          <v-checkbox disabled v-model="props.item.license_wl"></v-checkbox>
                        </td>
                        <td class="text-xs-center">
                          <v-checkbox disabled v-model="props.item.toAdmins"></v-checkbox>
                        </td>
                        </tr>
         </template> </v-data-table>
</template>

<script>
import Vuex from "vuex"
export default {
  props: {
    texts: Array,
    value: null
  },
  watch: {
    value() {
      this.selected = this.value
    }
  },
  data() {
    return {
      headers: [{
        text: 'Texte',
        value: 'text',
        sortable: false
      }, {
        text: 'Créateur',
        value: 'created_by'
      }, {
        text: 'Auteur',
        value: 'author'
      }, {
        text: "Tags",
        value: "tags"
      }, {
        text: "License",
        value: "license"
      }, {
        text: "Message",
        value: "toAdmins"
      }, ],
      selected: null,
    }
  },
  computed: { ...Vuex.mapGetters({
      avatar: "users/avatar",
      userById: "users/userById",
      authorNameById: "authors/authorNameById",
      isTextProblematic: "texts/isTextProblematic"
    })
  },
  methods: {
    abstract(modoTexts) {
      return text.title || text.content.slice(60)
    },
    select(textId) {
      this.selected = textId
      this.$emit("input", textId)
    },
    itemClasses(textId) {
      var classes = ""
      if (textId == this.selected) {classes += "selected "}
      if (this.isTextProblematic(textId)) { classes += "problematic "}
      return classes
    }
  }
}
</script>

<style>
tr.selected {
  border-left: 6px blue solid;
  background-color: #edefff !important;
}
tr.problematic {
  border-left: 6px red solid !important;
  background-color: #ffe0e0;
}
</style>
