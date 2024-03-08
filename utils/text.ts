function truncateText (text: string, size=40) {
  if (text.length > size) {
    return text.substring(0, size) + '...'
  }
  return text
}

export default truncateText
