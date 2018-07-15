import { store } from '@/store'; // path to your Vuex store

//////////////////// SNACKBAR ///////////////////////

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

//////////////////// DIALOG ///////////////////////

function dialog({
  title = "",
  text = "",
  width = 500,
  buttons = ["ok"], // ["ok", "yes", "no", "cancel"]
  titleColor = "grey lighten-2",
  markdown = true, //uses markdown
}) {
  {
    store.dispatch("components/dialog", {
      title: title,
      text: text,
      width: width,
      buttons: buttons,
      titleColor: titleColor,
      markdown: markdown,

    })
  }
}

export { dialog }

//////////////// FILTER FUNCTIONS ///////////////////////

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