<template>
<div>
  <v-combobox :items="items"
              v-model="internalSelected"
              :label="label"
              chips
              small-chips
              deletable-chips
              single-line
              hide-details
              multiple
              return-object
              dense
              prepend-inner-icon="search"
              :append-outer-icon="dialogButton? 'settings' : ''"
              @click:append-outer="showFilterDialog = true"
              :solo="solo"
              :filter="filter"
              :search-input.sync="search"
              @input="input"
              @keyup.enter="validates"
              @change="change">
    <!-- No data template --><template slot="no-data">
        <v-card flat>
          <v-card-text v-if="allowsCustomText && search">
            Appuie sur <kbd>enter</kbd> pour rechercher le texte <v-chip small label>{{search}}</v-chip>
          </v-card-text>
          <v-card-text v-if="!allowsCustomText">
            Aucun élément ne correspond à <v-chip small label>{{ search }}</v-chip>
          </v-card-text>
        </v-card>
     </template>
    <!-- Item template --><template slot="item"
              slot-scope="data">
              <!-- If text... -->
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
    <!-- If object... --><template v-else>
          <v-list-tile-action>
            <v-checkbox :input-value="isItemSelected(data.item.value)"></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="showCount">{{data.item.text}} <span class="grey--text">({{data.item.count}})</span></v-list-tile-title>
            <v-list-tile-title v-if="!showCount" v-html="data.item.text" ></v-list-tile-title>
          </v-list-tile-content>
        </template> </template>
  </v-combobox>
  <filter-dialog v-model="selected"
                 :show="showFilterDialog"
                 @close="showFilterDialog = false"
                 :include-authors="includeAuthors"
                 :warningLessThanTwoTags="warningLessThanTwoTags"></filter-dialog>
</div>
</template>

<script>
import { db } from '@/firebase'
import { filterTextsByIds } from "@/utils"
import Vuex from "vuex"
export default {
  props: {
    "value": Array,
    "label": String,
    "solo": Boolean,
    "allowsCustomText": Boolean,
    "showCount": Boolean, // Display the number of item for each tags. Requires "texts"
    "texts": Array, // The object counted, in their 'tags' prop
    "hideEmpty": Boolean, // Hide tags that have no texts
    "dialogButton": Boolean, // Shows the button for dialog
    "includeAuthors": Boolean, // Includes authors with tags
    "warning-less-than-two-tags": Boolean // Shows a warning in dialog if less than 2 tags are selected
  },
  data() {
    return {
      search: "",
      selected: this.value, // holds value
      internalSelected: [], // for combo box, we clear it
      showFilterDialog: false
    }
  },
  watch: {
    value() {
      this.selected = this.value
    },
    selected() {
      this.$emit("input", this.selected)
    }
  },
  computed: { ...Vuex.mapGetters({
      tags: "tags/tags",
      tagGroups: "tags/tagGroups",
      tagsIds: "tags/tagsIds",
      tagById: "tags/tagById",
      groupById: "tags/groupById",
      authors: "authors/authors",
      authorsIds: "authors/authorsIds"
    }),
    items() {
      var r = []
      // Tags
      this.tagGroups.forEach(g => {
        r.push({
          header: g.name,
          id: g.id,
          type: "group"
        })
        if (g.tags) {
          g.tags.forEach(tagId => {
            r.push({
              text: this.tagById(tagId).name,
              value: tagId,
              count: filterTextsByIds(this.texts, [tagId]).length
            })
          })
        }
      })
      // Authors
      if (this.includeAuthors) {
        r.push({
          header: "Auteurs",
          type: "author"
        })
        this.authors.forEach(a => {
          r.push({
            text: a.name,
            value: a.id,
            count: filterTextsByIds(this.texts, [a.id]).length,
          })
        })
      }
      if (this.hideEmpty) {
        // Hide empty items
        r = r.filter(item => item.count == undefined || item.count > 0)
        // Hide empty headers (meaning: header followed by header, or at the bottom)
        r = r.filter((item, idx, array) => !(item.header && (!array[idx + 1] || array[idx + 1].header)))
      }
      return r
    }
  },
  methods: {
    change(val) {},
    input(val) {
      var selected = this.internalSelected[0]
      // When custom text, selected is a string
      if (typeof (selected) == "string" && !this.allowsCustomText) {
        this.internalSelected = []
        return
      } else if (typeof (selected) == "object") {
        selected = selected.value
      }
      if (!this.selected.includes(selected)) {
        // Item is not there, we add it
        this.selected.push(selected)
      } else {
        // Item is here, we remove it
        this.selected.splice(this.selected.indexOf(selected), 1)
      }
      this.internalSelected = []
    },
    validates(keyEvent) {},
    filter(item, queryText, itemText) {
      // The filter function
      if (typeof (item) !== "string" && "header" in item) {
        if (item.type == "group") {
          // tag group
          var filtered = this.groupById(item.id).tags.filter(tagId => this.filter(this.tagById(tagId).name, queryText, this.tagById(tagId).name))
        } else if (item.type == "author") {
          // Author
          var filtered = this.authors.filter(a => this.filter(a.name, queryText, a.name))
        }
        return filtered.length != 0
      }
      // Default function from https://github.com/vuetifyjs/vuetify/blob/74553209a26255e9bff33ad98a6fac0d62f0212b/src/components/VSelect/mixins/select-autocomplete.js#L14-L23
      // <v-select autocomplete> will be deprecated in favor of <v-autocomplete>,
      // so it seems in the current dev branch
      const hasValue = val => val != null ? val : ''
      const text = hasValue(itemText)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    },
    isItemSelected(id) {
      // Returns true if tagId is selected
      return this.selected.some(e => e == id)
    }
  }
};
</script>
