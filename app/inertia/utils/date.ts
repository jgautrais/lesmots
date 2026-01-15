export const getCurrentDateFormatted = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)

  return `${year}-${month}-${day}`
}

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const isToday = (dateString: string): boolean => {
  return dateString === getCurrentDateFormatted()
}
