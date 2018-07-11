export default (text, l) => {
  l = l || 200
  if (text.length > l) {
    return text.slice(0, l) + " (…)"
  } else {
    return text
  }
}