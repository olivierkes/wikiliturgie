<template>
  <v-select :items="items"
            v-model="internalSelected"
            label="Rechercher…"
            chips
            max-height="auto"
            autocomplete
            single-line
            hide-details
            tags
            dense
            prepend-icon="filter_list"
            solo
            no-data-text="Texte de recherche personnalisé"
            :filter="filter"
            :search-input.sync="search"
            @input="input"
            @keyup.enter="validates"
            @change="change">
    <template slot="item" slot-scope="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-tile-content v-text="data.item"></v-list-tile-content>
      </template>
      <template v-else>
        <v-list-tile-action>
          <!-- <v-icon v-if="data.item" >star</v-icon> -->
          <v-checkbox :input-value="selectedItem(data.item.id)"></v-checkbox>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-html="data.item.text" ></v-list-tile-title>
        </v-list-tile-content>
      </template>
    </template>
  </v-select>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      search: "",
      internalSelected: [],
      selected: this.value,
      items: [
        { header: "Group 1" },
        { text: "Sandra Adams", group: "Group 1", type: "tag", id: 1 },
        { text: "Ali Connors", group: "Group 1", type: "tag", id: 2 },
        { text: "Trevor Hansen", group: "Group 1", type: "tag", id: 3 },
        { text: "Tucker Smith", group: "Group 1", type: "tag", id: 4 },
        { divider: true },
        { header: "Group 2" },
        { text: "Britta Holt", group: "Group 2", type: "tag", id: 5 },
        { text: "Jane Smith ", group: "Group 2", type: "tag", id: 6 },
        { text: "John Smith", group: "Group 2", type: "tag", id: 7 },
        { text: "Sandra Williams", group: "Group 2", type: "tag", id: 8 }
      ]}
  },
  watch: {
    value() {
      this.selected = this.value
    }
  },
  methods: {
    change(val) {},
    input(val) {
      var selected = this.internalSelected[0]
      // When custom search, selected is a string, so we mutate it in an object
      if (typeof(selected) == "string") {
        if (!selected.trim()) {
          this.internalSelected = []
          return}
        selected = {
          text: selected.trim(),
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
      this.$emit('input', this.selected)
    },
    validates(keyEvent) {},
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
    },
    selectedItem(id) {
      return this.selected.some(e => e.id == id)
    }
  }
};
</script>
