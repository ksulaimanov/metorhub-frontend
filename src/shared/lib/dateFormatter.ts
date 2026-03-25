/**
 * Форматирует дату и время в русском формате
 * Для отображения: "25 марта 2026, 14:30"
 * @param value ISO строка даты-времени
 * @param includeTime включать ли время (default: true)
 */
export const formatDateTimeForDisplay = (value: string, includeTime = true): string => {
  if (!value) return ''

  const date = new Date(value)

  if (isNaN(date.getTime())) return value

  if (includeTime) {
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Форматирует только время в русском формате
 * @param value ISO строка даты-времени
 */
export const formatTimeForDisplay = (value: string): string => {
  if (!value) return ''

  const date = new Date(value)

  if (isNaN(date.getTime())) return value

  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Форматирует дату для input type="datetime-local"
 * Возвращает: "2026-03-25T14:30"
 * @param value ISO строка даты-времени
 */
export const formatDateTimeForInput = (value: string): string => {
  if (!value) return ''

  const date = new Date(value)

  if (isNaN(date.getTime())) return value

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Парсит value из input type="datetime-local" в ISO строку
 * Входит: "2026-03-25T14:30"
 * Выходит: "2026-03-25T14:30:00.000Z"
 * @param value строка из datetime-local input
 */
export const parseDateTimeFromInput = (value: string): string => {
  if (!value) return ''

  const date = new Date(`${value}:00`)

  return date.toISOString()
}

