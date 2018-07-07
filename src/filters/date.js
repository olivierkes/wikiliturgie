export default (value) => {
  const date = value.toDate()
  return date.toLocaleString(
    ["fr-CH", "en-US"], {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
}