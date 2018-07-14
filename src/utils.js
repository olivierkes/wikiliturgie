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

// Filter texts  with given id (could be tag, author, ...)
function filterTextsByIds(texts, ids) {
  ids.forEach(id => {
    texts = texts.filter(txt => filterTextById(txt, id))
  })
  return texts
}

function filterTextById(text, id) {
  if (text.tags.some(t => t == id)) {
    // Tag
    return true
  } else if (text.author == id) {
    // Author
    return true
  } else {
    // Search text
    return JSON.stringify(text).toLowerCase()
      .indexOf(id.toLowerCase()) != -1
  }
}

export { filterTextsByIds, filterTextById }