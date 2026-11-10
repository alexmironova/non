import { useState } from 'react'
import Icon from './Icon.jsx'
import { MONTHS_NOM } from '../lib/period.js'

// Неделя с понедельника: так показывает календарь на русском, и так же
// стоят дни в самом приложении банка
const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

const pad = (n) => String(n).padStart(2, '0')
const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`
const daysIn = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate()

/** Номер первого дня месяца в неделе, 0 — понедельник. */
function firstWeekday(y, m) {
  const sunday0 = new Date(Date.UTC(y, m - 1, 1)).getUTCDay()
  return (sunday0 + 6) % 7
}

/**
 * Календарь на месяц с выбором диапазона дат.
 *
 * Даты — строки 'YYYY-MM-DD', а не `Date`: во всём проекте операции хранят
 * дату строкой, и сравнение строк здесь даёт тот же порядок без возни
 * с часовыми поясами, где 1 ноября легко превращается в 31 октября.
 *
 * Выбор держит родитель: календарь только показывает и сообщает о нажатии.
 */
export default function Calendar({ start, end, onPick, min, max }) {
  const [view, setView] = useState(() => ({ y: +max.slice(0, 4), m: +max.slice(5, 7) }))

  const shift = (step) => {
    const total = view.y * 12 + (view.m - 1) + step
    setView({ y: Math.floor(total / 12), m: (total % 12) + 1 })
  }

  // Листать дальше данных нечего: пустой месяц выглядел бы как сбой
  const canPrev = key(view.y, view.m, 1) > min
  const canNext = key(view.y, view.m, daysIn(view.y, view.m)) < max

  const blanks = firstWeekday(view.y, view.m)
  const days = daysIn(view.y, view.m)

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          className="ic-btn ghost"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="Предыдущий месяц"
        >
          <Icon name="back" size={20} />
        </button>
        <span className="cal-month">
          {MONTHS_NOM[view.m - 1]} {view.y}
        </span>
        <button
          className="ic-btn ghost"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label="Следующий месяц"
        >
          <Icon name="chev" size={20} />
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="cal-wd">
            {w}
          </span>
        ))}

        {Array.from({ length: blanks }, (_, i) => (
          <span key={`b${i}`} className="cal-blank" />
        ))}

        {Array.from({ length: days }, (_, i) => {
          const d = i + 1
          const k = key(view.y, view.m, d)
          const off = k < min || k > max
          const edge = k === start || k === end
          // Пока выбрана только первая дата, подсвечивать нечего
          const inside = start && end && k > start && k < end
          return (
            <button
              key={k}
              className={`cal-day${edge ? ' is-edge' : ''}${inside ? ' in-range' : ''}`}
              disabled={off}
              onClick={() => onPick(k)}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
