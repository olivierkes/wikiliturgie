<template>
<v-combobox :items="computedTags"
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
            prepend-icon="search"
            :solo="solo"
            :filter="filter"
            :search-input.sync="search"
            @input="input"
            @keyup.enter="validates"
            @change="change"> <template slot="no-data">
        <v-card flat>
          <v-card-text v-if="allowsCustomText">
            Appuie sur <kbd>enter</kbd> pour rechercher le texte <v-chip small label>{{search}}</v-chip>
          </v-card-text>
          <v-card-text v-if="!allowsCustomText">
            Aucun élément ne correspond à "<strong>{{ search }}</strong>"
          </v-card-text>
        </v-card>
       <!-- <v-list-tile>
         <v-list-tile-content>
           <v-list-tile-title v-if="allowsCustomText">
             Rechercher le texte <v-chip small label>{{search}}</v-chip>
           </v-list-tile-title>
             <v-list-tile-title v-if="!allowsCustomText">
               Aucun élément ne correspond à "<strong>{{ search }}</strong>"
             </v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile> -->
     </template> <template slot="item"
            slot-scope="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template> <template v-else>
          <v-list-tile-action>
            <!-- <v-icon v-if="data.item" >star</v-icon> -->
            <v-checkbox :input-value="selectedItem(data.item.id)"></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="showCount">{{data.item.text}} <span class="grey--text">({{data.item.tagCount}})</span></v-list-tile-title>
            <v-list-tile-title v-if="!showCount" v-html="data.item.text" ></v-list-tile-title>
          </v-list-tile-content>
        </template> </template>
</v-combobox>
</template>

<script>
import { db } from '@/firebase'
import { filterTextsByTagObjects } from "@/utils"
export default {
  props: {
    "value": Array,
    "tags": Array,
    "label": String,
    "solo": Boolean,
    "allowsCustomText": Boolean,
    "tagOnly": Boolean, // Returns array of tag's id only
    "showCount": Boolean, // Display the number of item for each tags. Requires "texts"
    "texts": Array, // The object counted, in their 'tags' prop
    "hideEmpty": Boolean // Hide tags that have no texts
  },
  data() {
    return {
      search: "",
      internalSelected: [],
      selectedInput: this.value,
    }
  },
  watch: {
    value() {
      this.selectedInput = this.value
    }
  },
  computed: {
    tagObject() { return this.$store.getters["tags/tagObject"] },
    selected() {
      // Must return an array of tagObject
      if (this.tagOnly) {
        return this.selectedInput ? this.selectedInput.map(tagId => this.tagObject(tagId)) : []
      } else {
        return this.selectedInput
      }
    },
    computedTags() {
      // Used for items
      if (!this.showCount || !this.texts) {
        // Normal tags
        return this.tags
      } else {
        // Tag with count
        var tags = []
        this.tags.forEach(t => {
          var tag = Object.assign({}, t)
          tag.tagCount = filterTextsByTagObjects(this.texts, [t]).length
          if ("header" in tag || "divider" in tag) {
            tags.push(tag)
          } else if (this.hideEmpty && !tag.tagCount) {
            // Not pushing empty tags
          } else {
            tags.push(tag)
          }
        })
        return tags
      }
    }
  },
  methods: {
    change(val) {},
    input(val) {
      var selected = this.internalSelected[0]
      // When custom text, selected is a string, so we mutate it in an object
      if (typeof (selected) == "string" && this.allowsCustomText) {
        if (!selected.trim()) {
          this.internalSelected = []
          return
        }
        selected = {
          text: selected.trim(),
          group: "Texte de recherche",
          type: "text"
        }
      } else if (typeof (selected) == "string" && !this.allowsCustomText) {
        this.internalSelected = []
        return
      }
      if (!this.selected.includes(selected) && // for tags
        !this.selected.some(e => e.text === selected.text && e.group === selected.group) // for custom search
      ) {
        this.selected.push(selected)
      }
      this.internalSelected = []
      this.emit()
    },
    validates(keyEvent) {},
    filter(item, queryText, itemText) {
      if ("header" in item || "divider" in item) {
        var filtered = this.computedTags.filter(i => i.groupId == item.groupId && i.type == "tag" && this.filter(i, queryText, i.text) == true)
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
    selectedItem(tagId) {
      // Returns true if tagId is selected
      return this.selected.some(e => e.id == tagId)
    },
    emit() {
      if (this.tagOnly) {
        // Returns array of tags ID only
        this.$emit("input", this.selected.map(s => s.id))
      } else {
        this.$emit("input", this.selected)
      }
    }
  }
};
</script>
