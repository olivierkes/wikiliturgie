<template>
<!-- @mouseover="overflow = true" @mouseleave="overflow=false" -->
<v-card v-if="text"
        :hover="abstract && !overflow"
        @dblclick="overflow=!overflow">
  <v-card-text :style="style">
    <!-- <p v-html="$options.filters.md(text.content.slice(0, 300))"></p> -->
    <h4 v-if="text.title"
        class="grey--text">{{text.title}}</h4>
    <p v-html="$options.filters.md(text.content)"></p>
    <p v-html="$options.filters.md(text.content)"></p>
    <p v-html="$options.filters.md(text.content)"></p>
    <p v-html="$options.filters.md(text.content)"></p>
  </v-card-text>
  <v-card-actions :class="(!abstract || overflow)? '':'elevation-2'">
    <v-btn v-if="abstract"
           icon
           @click.native="overflow = !overflow">
      <v-icon>{{ overflow ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn flat
           icon
           :to="'/text/' + text.id">
      <v-icon color="grey">edit</v-icon>
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  props: {
    text: Object,
    abstract: Boolean
  },
  data() {
    return {
      overflow: false,
    }
  },
  computed: {
    style() {
      return {
        height: (!this.abstract || this.overflow) ? "" : "300px",
        overflowY: "hidden"
      }
    }
  }
}
</script>
