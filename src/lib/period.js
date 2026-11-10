/**
 * Периоды и агрегаты для выписки.
 *
 * Операции хранят машинную дату в поле `ts` ('2025-10-07T14:02') — по ней
 * и считаем. Строковые `date` и `day` из моков для этого не годятся: там
 * нет года, а месяц в родительном падеже.
 *
 * «Сегодня» в приложении — 10 ноября 2026, последний день выписки по счёту
 * Black · 7711 (`data/ledger.js`). Берём
 * её из константы, а не из `new Date()`: иначе через месяц выписка за год
 * покажет полупустой период, а экран «История» так и останется в октябре.
 */
export const TODAY = '2026-11-10T23:59'

/**
 * За какие даты вообще есть операции. Ранняя граница — начало архива
 * (`data/ledger.js`), поздняя — «сегодня». Этим ограничен календарь:
 * листать в пустоту и выбирать период без данных нельзя.
 */
export const DATA_FROM = '2025-11-12'
export const DATA_TO = TODAY.slice(0, 10)

/** Пресеты периода. `months` — на сколько месяцев назад от «сегодня». */
export const PERIODS = [
  { key: '1m', label: 'Месяц', months: 1 },
  { key: '3m', label: '3 месяца', months: 3 },
  { key: '6m', label: 'Полгода', months: 6 },
  { key: '12m', label: 'Год', months: 12 },
]

export const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]
export const MONTHS_NOM = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
export const MONTHS_SHORT = [
  'янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
]

/** '2025-10-07T14:02' → { y, m, d } без часовых поясов и Date. */
function parts(ts) {
  return { y: +ts.slice(0, 4), m: +ts.slice(5, 7), d: +ts.slice(8, 10) }
}

/**
 * Начало периода — 1-е число месяца, отстоящего от текущего на `months - 1`.
 *
 * То есть период это целые календарные месяцы, последний из них неполный:
 * «Месяц» — это октябрь по сегодняшний день, «Год» — двенадцать месяцев,
 * считая текущий. Так сделано не ради простоты: при скользящем окне
 * («сегодня минус 12 месяцев») в период попадал бы хвост тринадцатого
 * месяца, которому неоткуда взяться на графике из 12 столбиков, и сумма
 * итогов перестала бы сходиться с суммой столбиков. Та же логика у экрана
 * «Расходы», где текущий месяц подписан «1–7 октября».
 */
export function periodStart(months, today = TODAY) {
  const { y, m } = parts(today)
  const total = y * 12 + (m - 1) - (months - 1)
  const ny = Math.floor(total / 12)
  const nm = (total % 12) + 1
  return `${ny}-${String(nm).padStart(2, '0')}-01T00:00`
}

/** Сколько дней в месяце: нужно и для границы диапазона, и для подписи. */
function daysIn(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

/**
 * Период — это диапазон `{ from, to }`, а не число месяцев.
 *
 * Пресеты сверху экрана описываются числом месяцев, но выбор в настройках —
 * отдельный месяц, с начала года — им не описывается. Поэтому считают всё
 * функции на диапазоне, а `months` остался только у пресетов.
 */
export function rangeOf(months, today = TODAY) {
  return { from: periodStart(months, today), to: today }
}

/** Весь календарный месяц по ключу: '2025-09' → сентябрь целиком. */
export function monthRange(key) {
  const y = +key.slice(0, 4)
  const m = +key.slice(5, 7)
  return { from: `${key}-01T00:00`, to: `${key}-${daysIn(y, m)}T23:59` }
}

/** С 1 января текущего года по сегодня. */
export function yearToDate(today = TODAY) {
  return { from: `${today.slice(0, 4)}-01-01T00:00`, to: today }
}

/** Операции диапазона. Строки ISO сравниваются лексикографически — этого хватает. */
export function inRange(ops, { from, to }) {
  return ops.filter((o) => o.ts >= from && o.ts <= to)
}

export function inPeriod(ops, months, today = TODAY) {
  return inRange(ops, rangeOf(months, today))
}

/** Сколько календарных месяцев задевает диапазон — от этого зависит график. */
export function rangeMonths({ from, to }) {
  const a = parts(from)
  const b = parts(to)
  return b.y * 12 + b.m - (a.y * 12 + a.m) + 1
}

/** Итоги по списку: поступления, расходы (положительным числом), кэшбэк. */
export function totals(ops) {
  return ops.reduce(
    (acc, o) => {
      if (o.amount > 0) acc.income += o.amount
      else acc.expense += -o.amount
      acc.cashback += o.cashback ?? 0
      return acc
    },
    { income: 0, expense: 0, cashback: 0 }
  )
}

/** '2025-10' — ключ месяца, по нему группируем и строим столбики. */
export function monthKey(ts) {
  return ts.slice(0, 7)
}

/** 'Октябрь 2025' — заголовок группы в списке операций. */
export function monthTitle(key) {
  const [y, m] = key.split('-')
  return `${MONTHS_NOM[+m - 1]} ${y}`
}

/** '7 октября' — подпись периода и дат. */
export function dayTitle(ts) {
  const { m, d } = parts(ts)
  return `${d} ${MONTHS_GEN[m - 1]}`
}

/**
 * Подпись диапазона под суммой.
 *
 * Неполный месяц — '1–7 октября', теми же словами, что на экране «Расходы».
 * Целый месяц — просто 'сентябрь'. Несколько месяцев — по названиям:
 * 'август — октябрь', а через новый год с годами: 'ноябрь 2024 — октябрь
 * 2025'. Полные даты с числами в строку не помещаются и переносятся посреди
 * названия месяца, поэтому их тут нет.
 */
export function rangeCaption({ from, to }) {
  const a = parts(from)
  const b = parts(to)
  const now = +TODAY.slice(0, 4)
  const year = (y) => (y === now ? '' : ` ${y}`)

  if (a.y === b.y && a.m === b.m) {
    if (a.d === 1 && b.d === daysIn(a.y, a.m)) {
      return `${MONTHS_NOM[a.m - 1].toLowerCase()}${year(a.y)}`
    }
    // Один день выбран — «10–10 июня» выглядит как недоделанный диапазон
    const days = a.d === b.d ? `${a.d}` : `${a.d}–${b.d}`
    return `${days} ${MONTHS_GEN[a.m - 1]}${year(a.y)}`
  }

  // Через год месяц сокращаем: '1 ноября 2024 — 7 октября 2025' не влезает
  // в половину карточки итогов и переносится посреди названия месяца
  if (a.y !== b.y) {
    const short = (t) => `${t.d} ${MONTHS_SHORT[t.m - 1]} ${t.y}`
    return `${short(a)} — ${short(b)}`
  }
  const name = (t) => `${t.d} ${MONTHS_GEN[t.m - 1]}`
  return `${name(a)} — ${name(b)}`
}

/** Компактная подпись для чипа: '1 авг — 7 окт'. */
export function shortRange({ from, to }) {
  const a = parts(from)
  const b = parts(to)
  const now = +TODAY.slice(0, 4)
  const one = (t) => `${t.d} ${MONTHS_SHORT[t.m - 1]}${t.y === now ? '' : ` ${t.y}`}`
  return from.slice(0, 10) === to.slice(0, 10) ? one(a) : `${one(a)} — ${one(b)}`
}

/** Диапазон по двум датам 'YYYY-MM-DD' включительно. */
export function daysRange(from, to) {
  return { from: `${from}T00:00`, to: `${to}T23:59` }
}

export function periodCaption(months, today = TODAY) {
  return rangeCaption(rangeOf(months, today))
}

/**
 * Столбики расходов по месяцам за период. Высота — доля от самого дорогого
 * месяца, минимум 6% — иначе пустой месяц выглядит как дырка в графике.
 */
export function monthBars(ops, range) {
  const a = parts(range.from)
  const first = a.y * 12 + (a.m - 1)
  const keys = []
  for (let i = 0; i < rangeMonths(range); i++) {
    const total = first + i
    keys.push(`${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`)
  }

  const sums = new Map(keys.map((k) => [k, 0]))
  for (const o of ops) {
    const k = monthKey(o.ts)
    if (o.amount < 0 && sums.has(k)) sums.set(k, sums.get(k) + -o.amount)
  }

  const max = Math.max(...sums.values(), 1)
  return keys.map((k, i) => ({
    key: k,
    m: MONTHS_SHORT[+k.slice(5, 7) - 1],
    sum: sums.get(k),
    h: Math.max(6, Math.round((sums.get(k) / max) * 100)),
    active: i === keys.length - 1,
  }))
}

/**
 * Траты по категориям, от крупных к мелким, с долей в процентах.
 *
 * Перевод на свой же накопительный счёт в разбивку не попадает: деньги со
 * счёта ушли, но это не трата, а перекладывание. В октябре такой перевод
 * один — и он забирал 59% диаграммы, оттесняя настоящие покупки. В итоги
 * сверху он при этом входит: по счёту движение было.
 */
const NOT_SPENDING = new Set(['Между своими счетами'])

export function breakdown(ops, mode = 'expense') {
  const byName = new Map()
  for (const o of ops) {
    let value = 0
    if (mode === 'income') {
      if (o.amount <= 0) continue
      value = o.amount
    } else if (mode === 'cashback') {
      if (!o.cashback) continue
      value = o.cashback
    } else {
      if (o.amount >= 0 || NOT_SPENDING.has(o.category)) continue
      value = -o.amount
    }
    const cur = byName.get(o.category) ??
      { name: o.category, amount: 0, icon: o.icon, initials: o.initials, pic: o.pic }
    cur.amount += value
    byName.set(o.category, cur)
  }
  const list = [...byName.values()].sort((a, b) => b.amount - a.amount)
  const sum = list.reduce((s, c) => s + c.amount, 0) || 1
  return list.map((c) => ({ ...c, share: Math.round((c.amount / sum) * 100) }))
}

/** Траты по категориям — самый частый случай разбивки. */
export function categoryTotals(ops) {
  return breakdown(ops, 'expense')
}

/** Операции одного календарного месяца: ключ вида '2025-10'. */
export function inMonth(ops, key) {
  return ops.filter((o) => monthKey(o.ts) === key)
}

/** Последние `n` месяцев, от давних к текущему: [{ key, label }]. */
export function lastMonths(n, today = TODAY) {
  const y = +today.slice(0, 4)
  const m = +today.slice(5, 7)
  const out = []
  for (let i = n - 1; i >= 0; i--) {
    const total = y * 12 + (m - 1) - i
    const ky = Math.floor(total / 12)
    const km = (total % 12) + 1
    out.push({
      key: `${ky}-${String(km).padStart(2, '0')}`,
      label: MONTHS_NOM[km - 1],
    })
  }
  return out
}

/**
 * Верхние `top` категорий, остальные — одной строкой «Другое». Так устроен
 * и мок `categories` на экране «Расходы»: длинный хвост мелких категорий
 * читать невозможно, а сумма при этом должна сходиться.
 */
export function topCategories(ops, top = 6, mode = 'expense') {
  const list = breakdown(ops, mode)
  if (list.length <= top + 1) return list
  const head = list.slice(0, top)
  const rest = list.slice(top)
  const amount = rest.reduce((s, c) => s + c.amount, 0)
  const share = rest.reduce((s, c) => s + c.share, 0)
  return [...head, { name: 'Другое', amount, share, icon: 'more', pic: 'gray' }]
}

/** Группировка списка по дням (короткий период) или по месяцам (длинный). */
export function groupOps(ops, byDay) {
  const groups = []
  const index = new Map()
  for (const o of ops) {
    const key = byDay ? o.ts.slice(0, 10) : monthKey(o.ts)
    if (!index.has(key)) {
      const title = byDay ? (o.day ?? dayTitle(o.ts)) : monthTitle(key)
      const group = { key, title, items: [] }
      index.set(key, group)
      groups.push(group)
    }
    index.get(key).items.push(o)
  }
  return groups
}
