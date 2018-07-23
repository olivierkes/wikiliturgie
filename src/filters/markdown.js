// var markdown = require("markdown").markdown

import marked from 'marked'
marked.setOptions({
  gfm: true
})

// function markdown(mdContent, breaks = true) {
//   // return markdown.toHTML(mdContent, "Maruku")
//   marked.setOptions({ breaks: breaks })
//   return marked(mdContent)
// }


// Markdown table of content
// Found here: https://github.com/markedjs/marked/issues/334#issuecomment-33571577
var renderer = new marked.Renderer()
var toc = [] // your table of contents as a list.

renderer.heading = function(text, level) {
  var slug = text.toLowerCase().replace(/[^\w]+/g, '-')
  toc.push({
    level: level,
    slug: slug,
    title: text
  })
  // return "<h" + level + " id=\"" + slug + "\"><a href=\"#" + slug + "\" class=\"anchor\"></a>" + text + "</h" + level + ">";
  return "<h" + level + " id=\"" + slug + "\" ref=\"" + slug + "\">" + text + "</h" + level + ">";
}

function markdown(mdContent, breaks = true) {
  marked.setOptions({ breaks: breaks })
  return marked(mdContent, {
    renderer: renderer
  })
}

function tocToTree(toc) {
  var headlines = []
  var last = {}
  var level = 0

  toc.forEach(headline => {
    level = headline.level || 1
    if (last[level - 1]) {
      last[level - 1].children = last[level - 1].children || []
      last[level - 1].children.push(headline)
    } else {
      headlines.push(headline)
    }
    last[level] = headline
  })

  return headlines
}

function mdTOC(mdContent) {
  toc = []
  markdown(mdContent)
  // return tocToTree(toc)
  return toc

}

export { markdown, mdTOC }