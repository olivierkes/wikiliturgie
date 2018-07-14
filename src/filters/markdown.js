// var markdown = require("markdown").markdown

import marked from 'marked'
marked.setOptions({
  gfm: true,
  breaks: true
})

export default (mdContent) => {
  // return markdown.toHTML(mdContent, "Maruku")
  return marked(mdContent)
}