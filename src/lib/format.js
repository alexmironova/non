/** Форматирование денег по-русски: 32 450,25 ₽ (неразрывный пробел перед знаком) */
export function money(value, { sign = false, currency = '₽' } = {}) {
  const abs = Math.abs(value)
  const str = abs.toLocaleString('ru-RU', {
    minimumFractionDigits: Number.isInteger(abs) ? 0 : 2,
    maximumFractionDigits: 2,
  })
  const prefix = sign ? (value > 0 ? '+ ' : '− ') : value < 0 ? '− ' : ''
  return `${prefix}${str} ${currency}`
}

/**
 * Разряды для поля ввода суммы: 3000 → 3 000.
 * Разделитель — U+00A0, тот же, что отдаёт Intl в money(),
 * иначе одна сумма выглядит по-разному на соседних экранах.
 */
export function groupDigits(digits) {
  if (!digits) return '0'
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
