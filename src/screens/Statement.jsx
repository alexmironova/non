import { useEffect, useMemo, useRef, useState } from 'react'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Chips, Segmented } from '../components/controls.jsx'
import { Sheet } from '../components/Overlays.jsx'
import EmailSheet from '../components/EmailSheet.jsx'
import Calendar from '../components/Calendar.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { accountOperations } from '../data/mock.js'
import {
  PERIODS, inRange, totals, monthBars, topCategories, groupOps,
  rangeOf, rangeMonths, rangeCaption, shortRange, daysRange, DATA_FROM, DATA_TO,
} from '../lib/period.js'

const FILTERS = ['Все', 'Расходы', 'Поступления']
const PAGE = 30

const PRESETS = PERIODS.map((p) => ({ key: p.key, label: p.label, range: rangeOf(p.months) }))

/**
 * Выписка по счёту: пресет периода, итоги и движение средств.
 *
 * Собрана из тех же компонентов, что остальные экраны: пресеты — `Chips`,
 * как месяцы на «Расходах», фильтр — `Segmented`, список — `Row` в `.list
 * inset`, столбики — `.bars`, как «Сравнение по месяцам». Отличие от
 * «Истории» одно: здесь всё считается из операций, а не вписано в разметку,
 * поэтому пресет действительно меняет цифры.
 */
export default function Statement() {
  const { showToast } = useApp()
  const [period, setPeriod] = useState(0)
  const [filter, setFilter] = useState(0)
  const [limit, setLimit] = useState(PAGE)
  // Шторки: null — закрыта, 'email' — запрос выписки на почту,
  // 'period' — настройки с дополнительными периодами
  const [sheet, setSheet] = useState(null)
  // Выбранный в настройках период становится пятым чипом: иначе непонятно,
  // за что показаны цифры, когда ни один пресет не подсвечен
  const [custom, setCustom] = useState(null)
  // Черновик выбора в календаре: применяется только по кнопке, чтобы
  // половина диапазона не пересчитывала экран под руками
  const [draft, setDraft] = useState({ start: null, end: null })
  const chipsRow = useRef(null)

  const chips = custom ? [...PRESETS, custom] : PRESETS
  const { range } = chips[period] ?? chips[0]
  const months = rangeMonths(range)

  const { ops, sum, bars, cats } = useMemo(() => {
    const ops = inRange(accountOperations, range)
    return {
      ops,
      sum: totals(ops),
      bars: monthBars(ops, range),
      cats: topCategories(ops),
    }
  }, [range.from, range.to])

  // Фильтр по знаку суммы: расход — отрицательная, поступление — положительная
  const listed = useMemo(() => {
    if (filter === 1) return ops.filter((o) => o.amount < 0)
    if (filter === 2) return ops.filter((o) => o.amount > 0)
    return ops
  }, [ops, filter])

  const shown = listed.slice(0, limit)
  // Месяц показываем по дням, длинные периоды — по месяцам: 300 строк,
  // разбитых по дням, превращаются в сплошную ленту заголовков
  const groups = groupOps(shown, months === 1)

  // Любая смена периода или фильтра начинает список заново, иначе после
  // «Показать ещё» новый период открывается уже прокрученным на 200 строк
  const pick = (setter) => (idx) => {
    setter(idx)
    setLimit(PAGE)
  }

  const closeSheet = () => setSheet(null)

  // Новый чип встаёт последним в прокручиваемом ряду и без этого оказывается
  // за правым краем: выбор сделан, а подтверждения не видно
  useEffect(() => {
    if (!custom) return
    const chips = chipsRow.current?.querySelector('.chips')
    chips?.scrollTo({ left: chips.scrollWidth, behavior: 'smooth' })
  }, [custom])

  /**
   * Нажатие по дню. Первое задаёт начало, второе — конец; дата раньше начала
   * начинает выбор заново, иначе диапазон пришлось бы отменять отдельной
   * кнопкой. Полный диапазон тоже начинает заново — так ведут себя календари
   * в банковских приложениях.
   */
  const pickDay = (day) => {
    setDraft(({ start, end }) =>
      !start || end || day < start ? { start: day, end: null } : { start, end: day }
    )
  }

  // Применённый период заменяет прежний дополнительный чип, а не копит их
  const applyDraft = () => {
    const range = daysRange(draft.start, draft.end)
    setCustom({ key: 'custom', label: shortRange(range), range })
    setPeriod(PRESETS.length)
    setLimit(PAGE)
    setSheet(null)
  }

  const openCalendar = () => {
    // Открываем на том, что уже выбрано: иначе пользователь каждый раз
    // заново ищет свой же период
    setDraft(
      custom
        ? { start: custom.range.from.slice(0, 10), end: custom.range.to.slice(0, 10) }
        : { start: null, end: null }
    )
    setSheet('period')
  }

  return (
    // Таб-бар и кнопка снизу одновременно — как на «Инвестициях»:
    // выписка теперь основной экран операций, а не всплывающий документ
    <Screen tabbar cta>
      <NavHeader
        title="Выписка"
        right={
          <button
            className="ic-btn ghost"
            aria-label="Отправить"
            onClick={() => setSheet('form')}
          >
            <Icon name="share" size={22} />
          </button>
        }
      />

      <div style={{ padding: '0 16px 12px' }}>
        <button
          className="search-pill"
          onClick={() => showToast('Поиск по операциям — экрана пока нет')}
        >
          <Icon name="search" size={20} />
          <span>Поиск по операциям</span>
        </button>
      </div>

      <div className="chips-row" ref={chipsRow}>
        <Chips
          items={chips.map((c) => ({ key: c.key, label: c.label }))}
          value={period}
          onChange={pick(setPeriod)}
        />
        <button
          className="ic-btn"
          aria-label="Настройки периода"
          onClick={openCalendar}
        >
          <Icon name="gear" size={20} />
        </button>
      </div>

      <Section>
        <div className="card pad">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="t-cap">Поступления</div>
              <div className="t-h3 num pos" style={{ marginTop: 4 }}>
                {money(sum.income)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="t-cap">Расходы</div>
              <div className="t-h3 num" style={{ marginTop: 4 }}>
                {money(sum.expense)}
              </div>
            </div>
          </div>

          <div className="card-split">
            <span className="t-cap">{rangeCaption(range)}</span>
            <span className="t-cap">
              {ops.length} {opsWord(ops.length)} · кэшбэк {money(sum.cashback)}
            </span>
          </div>
        </div>
      </Section>

      {bars.length > 1 && (
        <Section>
          <div className="card pad">
            <div className="t-sub" style={{ marginBottom: 12 }}>
              Расходы по месяцам
            </div>
            <div className={`bars${months > 6 ? ' dense' : ''}`}>
              {bars.map((b) => (
                <div key={b.key} className={`bar${b.active ? ' active' : ''}`}>
                  <i style={{ height: `${b.h}%` }} />
                  <span>{b.m}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section title="Траты по категориям" flush>
        <div className="list inset">
          {cats.map((c) => (
            <Row
              key={c.name}
              icon={c.icon}
              initials={c.icon ? undefined : c.initials}
              color={c.pic}
              title={c.name}
              sub={`${c.share}% от трат`}
              value={money(c.amount)}
            />
          ))}
        </div>
      </Section>

      <Section>
        <Segmented items={FILTERS} value={filter} onChange={pick(setFilter)} />
      </Section>

      {groups.map((g) => (
        <div key={g.key}>
          <div className="group-label">{g.title}</div>
          <div className="list inset">
            {g.items.map((o) => (
              <Row
                key={o.id}
                icon={o.icon}
                initials={o.initials}
                color={o.pic}
                title={o.title}
                sub={o.pending ? 'В обработке' : o.category}
                value={money(o.amount, { sign: o.amount > 0 })}
                note={o.cashback ? `+${o.cashback} ₽` : undefined}
                valueClass={o.amount > 0 ? 'pos' : ''}
                to={`/operation/${o.id}`}
              />
            ))}
          </div>
        </div>
      ))}

      {shown.length < listed.length && (
        <div style={{ padding: '16px 16px 8px' }}>
          <button className="btn btn-secondary" onClick={() => setLimit((v) => v + PAGE)}>
            Показать ещё
          </button>
        </div>
      )}

      <p className="t-cap" style={{ padding: '8px var(--gutter) 24px' }}>
        Выписка информационная. Документ с подписью банка приходит на почту.
      </p>

      <div className="sticky-cta above-tabbar">
        <button className="btn btn-primary" onClick={() => setSheet('email')}>
          Сохранить в PDF
        </button>
      </div>

      {sheet === 'period' && (
        <Sheet title="Период выписки" onClose={() => setSheet(null)}>
          <Calendar
            start={draft.start}
            end={draft.end}
            onPick={pickDay}
            min={DATA_FROM}
            max={DATA_TO}
          />

          <div className="cal-foot">
            <span className="t-cap">
              {draft.start && draft.end
                ? rangeCaption(daysRange(draft.start, draft.end))
                : draft.start
                  ? 'Выберите дату окончания'
                  : 'Выберите начало периода'}
            </span>
            <button
              className="btn btn-primary"
              disabled={!draft.start || !draft.end}
              onClick={applyDraft}
            >
              Применить
            </button>
          </div>
        </Sheet>
      )}

      {sheet === 'email' && <EmailSheet what="Выписка" onClose={closeSheet} />}
    </Screen>
  )
}

/** «32 операции» против «31 операция» — иначе подпись выглядит машинной. */
function opsWord(n) {
  const last = n % 10
  const tens = n % 100
  if (last === 1 && tens !== 11) return 'операция'
  if (last >= 2 && last <= 4 && (tens < 12 || tens > 14)) return 'операции'
  return 'операций'
}
