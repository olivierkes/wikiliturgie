<template>
  <v-select :items="tags"
            v-model="internalSelected"
            :label="label"
            chips
            autocomplete
            single-line
            hide-details
            tags
            dense
            prepend-icon="search"
            :solo = "solo"
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
import { db } from '@/firebase'
export default {
  props: {
    "value": Array,
    "tags": Array,
    "label": String,
    "solo": Boolean,
    "allowsCustomSearch": Boolean},
  data() {
    return {
      search: "",
      internalSelected: [],
      selected: this.value,
    }
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
      if (typeof(selected) == "string" && this.allowsCustomSearch) {
        if (!selected.trim()) {
          this.internalSelected = []
          return}
        selected = {
          text: selected.trim(),
          group: "Texte de recherche",
          type: "text"
        }
      }
      else if (typeof(selected) == "string" && !this.allowsCustomSearch){
        this.internalSelected = []
        return
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
        var filtered = this.tags.filter(i => i.groupId == item.groupId
                                              && i.type == "tag"
                                              && this.filter(i, queryText, i.text) == true)
        return filtered.length != 0
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
