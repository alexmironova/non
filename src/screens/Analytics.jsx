import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Chips, Segmented } from '../components/controls.jsx'
import { Banner } from '../components/cards.jsx'
import Icon from '../components/Icon.jsx'
import { money } from '../lib/format.js'
import { accountOperations, categoryColors } from '../data/mock.js'
import {
  TODAY, lastMonths, inMonth, topCategories, monthBars, inPeriod, monthKey, rangeOf,
  MONTHS_GEN,
} from '../lib/period.js'

// Длина окружности для r=56: 2πr ≈ 351.86
const C = 351.86

// `of` — родительный падеж для подписи «31% от расходов»: от label его
// не получить, а «31% от расходы» сразу выдаёт шаблон
const MODES = [
  { label: 'Расходы', of: 'расходов', mode: 'expense' },
  { label: 'Поступления', of: 'поступлений', mode: 'income' },
  { label: 'Кэшбэк', of: 'кэшбэка', mode: 'cashback' },
]

const MONTHS = lastMonths(3)
const CURRENT = monthKey(TODAY)

export default function Analytics() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(MONTHS.length - 1)
  const [mode, setMode] = useState(0)

  const { key } = MONTHS[month]
  const { cats, total, segments } = useMemo(() => {
    const cats = topCategories(inMonth(accountOperations, key), 6, MODES[mode].mode)
    const total = cats.reduce((s, c) => s + c.amount, 0)

    // Дуги считаем от сумм, а не от округлённых процентов: 7 категорий дают
    // в сумме 101–103%, и последний сегмент заезжал бы на первый
    let offset = 0
    const segments = cats.map((c) => {
      const len = (C * c.amount) / (total || 1)
      const seg = { color: categoryColors(c.name), len: Math.max(len - 2, 1), gap: C - len, offset: -offset }
      offset += len
      return seg
    })
    return { cats, total, segments }
  }, [key, mode])

  // Столбики — всегда расходы за полгода: это фон, на котором читается месяц
  const bars = useMemo(() => {
    const half = monthBars(inPeriod(accountOperations, 6), rangeOf(6))
    return half.map((b) => ({ ...b, active: b.key === key }))
  }, [key])

  // Название месяца берём из TODAY, а не вписываем: «сегодня» сдвигается
  // вместе с выпиской, и подпись не должна от неё отставать
  const caption =
    key === CURRENT
      ? `1–${+TODAY.slice(8, 10)} ${MONTHS_GEN[+TODAY.slice(5, 7) - 1]}`
      : MONTHS[month].label

  return (
    <Screen tabbar>
      <NavHeader
        title={MODES[mode].label}
        back="/home"
        right={
          <button
            className="ic-btn ghost"
            aria-label="Выписка"
            onClick={() => navigate('/statement')}
          >
            <Icon name="doc" size={22} />
          </button>
        }
      />

      <Segmented items={MODES.map((m) => m.label)} value={mode} onChange={setMode} />
      <Chips items={MONTHS.map((m) => m.label)} value={month} onChange={setMonth} />

      <div className="donut-wrap">
        <svg width="200" height="200" viewBox="0 0 140 140">
          {segments.map((s, i) => (
            <circle
              key={i}
              cx="70" cy="70" r="56" fill="none"
              stroke={s.color} strokeWidth="22"
              strokeDasharray={`${s.len} ${s.gap}`}
              strokeDashoffset={s.offset}
              transform="rotate(-90 70 70)"
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="dc-sum num">{money(total)}</div>
          <div className="dc-lab">{caption}</div>
        </div>
      </div>

      <Section>
        <div className="card pad">
          <div className="t-sub" style={{ marginBottom: 12 }}>
            Сравнение по месяцам
          </div>
          <div className="bars">
            {bars.map((b) => (
              <div key={b.key} className={`bar${b.active ? ' active' : ''}`}>
                <i style={{ height: `${b.h}%` }} />
                <span>{b.m}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Категории" link="Вся выписка" onLink={() => navigate('/statement')} flush>
        <div className="list inset">
          {cats.map((c) => (
            <Row
              key={c.name}
              icon={c.icon}
              initials={c.icon ? undefined : c.initials}
              color={c.pic}
              title={c.name}
              sub={`${c.share}% от ${MODES[mode].of}`}
              value={money(c.amount)}
              chevron
              to="/statement"
            />
          ))}
        </div>
      </Section>

      <Section>
        <Banner
          variant="soft"
          icon="chart"
          title="Траты выше на 18%"
          text="Чем в октябре. Поставьте лимит на супермаркеты"
        />
      </Section>
    </Screen>
  )
}
