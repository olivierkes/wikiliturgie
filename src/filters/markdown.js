// var markdown = require("markdown").markdown

import marked from 'marked'
marked.setOptions({
  gfm: true
})

export default (mdContent, breaks = true) => {
  // return markdown.toHTML(mdContent, "Maruku")
  marked.setOptions({ breaks: breaks })
  return marked(mdContent)
}