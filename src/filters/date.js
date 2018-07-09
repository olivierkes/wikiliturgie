export default (value) => {
  var date
  if (!value) {
    return ""
  } else if (value.methodName && value.methodName == "FieldValue.serverTimestamp") {
    // Firebase timestamp
    date = Date.now
  } else {
    date = value.toDate()
  }
  return date.toLocaleString(
    ["fr-CH", "en-US"], {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
}