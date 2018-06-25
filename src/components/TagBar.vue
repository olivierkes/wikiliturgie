<template>
<v-container>
  <v-layout column>
    <v-flex xs12>
      <v-select prepend-icon="filter_list"
                :items="items"
                v-model="internalSelected"
                label="Rechercher…"
                chips
                max-height="auto"
                autocomplete
                hide-details
                single-line
                hide-selected
                tags
                no-data-text="Texte de recherche personnalisé"
                :filter="filter"
                :search-input.sync="search"
                @input="input"
                @keyup.enter="validates"
                @change="change"> </v-select>
    </v-flex>
    <v-flex xs12>
      <v-tooltip v-for="chip in selected" bottom>
        <v-chip close
                small
                label
                :color="(chip.type == 'tag') ? 'grey' : 'blue-grey lighten-2'"
                @input="remove(chip)"
                slot="activator"> {{chip.text}} </v-chip>
        <span> {{ chip.group }}</span>
      </v-tooltip>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      search: "",
      internalSelected: [],
      items: [
        { header: "Group 1" },
        { text: "Sandra Adams", group: "Group 1", type: "tag" },
        { text: "Ali Connors", group: "Group 1", type: "tag" },
        { text: "Trevor Hansen", group: "Group 1", type: "tag" },
        { text: "Tucker Smith", group: "Group 1", type: "tag" },
        { divider: true },
        { header: "Group 2" },
        { text: "Britta Holt", group: "Group 2", type: "tag" },
        { text: "Jane Smith ", group: "Group 2", type: "tag" },
        { text: "John Smith", group: "Group 2", type: "tag" },
        { text: "Sandra Williams", group: "Group 2", type: "tag" }
      ]}
  },
  methods: {
    change(val) {},
    input(val) {
      var selected = this.internalSelected[0]
      // When custom search, selected is a string, so we mutate it in an object
      if (typeof(selected) == "string") {
        selected = {
          text: selected,
          group: "Texte de recherche",
          type: "text"
        }
      }
      if (!this.selected.includes(selected) && // for tags
          !this.selected.some(e => e.text === selected.text && e.group === selected.group) // for custom search
          ) {
        this.selected.push(selected)
      }
      this.internalSelected = []
    },
    validates(keyEvent) {},
    remove(item) {
      this.selected.splice(this.selected.indexOf(item), 1)
      this.selected = [...this.selected]
    },
    filter (item, queryText, itemText) {
      if ("header" in item || "divider" in item) {
        return true
      }
      // Default function from https://github.com/vuetifyjs/vuetify/blob/74553209a26255e9bff33ad98a6fac0d62f0212b/src/components/VSelect/mixins/select-autocomplete.js#L14-L23
      // <v-select autocomplete> will be deprecated in favor of <v-autocomplete>,
      // so it seems in the current dev branch
      const hasValue = val => val != null ? val : ''
      const text = hasValue(itemText)
      const query = hasValue(queryText)
      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    }
  }
};
</script>
