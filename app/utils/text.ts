export function truncateText (text: string, size=40) {
  if (text.length > size) {
    return text.substring(0, size) + '...'
  }
  return text
}

export function translateDateMonth(date: string): string {
  if (!date) {
      return ''
  }

  type monthType = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December'

  const monthDict: { [key in monthType]: string } = {
      'January': 'enero',
      'February': 'febrero',
      'March': 'marzo',
      'April': 'abril',
      'May': 'mayo',
      'June': 'Junio',
      'July': 'julio',
      'August': 'Agosto',
      'September': 'setiembre',
      'October': 'octubre',
      'November': 'noviembre',
      'December': 'diciembre'
  }
  const rExp = /de (\w*) del/
  const matches: RegExpExecArray = rExp.exec(date) as RegExpExecArray
  const month: monthType = matches[1] as monthType
  const newDate = date.replace(month, monthDict[month])

  return newDate
}
