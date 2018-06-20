var markdown = require("markdown").markdown
export default (mdContent) => {
  return markdown.toHTML(mdContent.split("\\n").join("\n"))
}