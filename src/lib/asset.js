/**
 * Путь к файлу из public/.
 * Через BASE_URL, а не относительно страницы: приложение живёт на хэш-роутах
 * и может быть опубликовано в подпапке (GitHub Pages), где относительный
 * путь разъехался бы.
 */
export function asset(path) {
  if (!path) return undefined
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
