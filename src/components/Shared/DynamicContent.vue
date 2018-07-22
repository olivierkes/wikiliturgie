<template>
<div>
  <my-temp-component>{{content}}</my-temp-component>
</div>
</template>

<script>
import Vue from "vue"
Vue.component("my-temp-component", {
  template: "<div>loading...</div>"
})
export default {
  props: {
    "content": String
  },
  watch: {
    content: {
      immediate: true,
      handler(newVal, oldVal) {
        if (oldVal != newVal) {
          this.render()
        }
      }
    }
  },
  methods: {
    render() {
      Vue.component("my-temp-component", {
        // template string here
        template: "<div>" + this.content + "</div>"
      })
    }
  }
}
</script>
