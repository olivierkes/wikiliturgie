var JsDiff = require("diff")

export default (firstText, secondText) => {
  var diff = JsDiff.diffWords(firstText, secondText)
  var res = ""
  diff.forEach(function(part) {
    var cls = part.added ? 'added' : part.removed ? 'removed' : 'unchanged'
    res += "<span class='" + cls + "'>" + part.value + "</span>"
  })
  return res
}