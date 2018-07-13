import { store } from '@/store'; // path to your Vuex store

function snackbar(text, {
  timeout = 2000,
  multiLine = false,
  color = "pink",
  position = "bottom",
  background = ""
} = {}) {
  store.dispatch("components/snackbar", {
    text: text,
    timeout: timeout,
    multiLine: multiLine,
    color: color,
    top: position == "top",
    bottom: position == "bottom",
    background: background
  })
}

export { snackbar }

// Filter texts  with given tagObject
function filterTextsByTagObjects(texts, tagObjects) {
  tagObjects.forEach(to => {
    texts = texts.filter(txt => filterTextByTagObject(txt, to))
  })
  return texts
}

function filterTextByTagObject(text, tagObject) {
  if (tagObject.type == "text") {
    return JSON.stringify(text).toLowerCase()
      .indexOf(tagObject.text.toLowerCase()) != -1
  } else if (tagObject.type == "tag") {
    return text.tags.some(t => t == tagObject.id)
  } else if (tagObject.type == "author") {
    return text.author == tagObject.id
  }
}

export { filterTextsByTagObjects, filterTextByTagObject }