import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { QuickAction, Chips } from '../components/controls.jsx'
import { BankCard } from '../components/cards.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { accountOperations } from '../data/mock.js'
import { groupOps } from '../lib/period.js'

const FILTERS = ['Все операции', 'Расходы', 'Поступления']
// Сколько строк показываем до «Показать ещё». Вся выписка — 148 операций:
// вывалить их на экран карты одним списком нельзя
const PAGE = 12

export default function Card() {
  const navigate = useNavigate()
  const { hideBalance, toggleBalance } = useApp()
  const [filter, setFilter] = useState(0)
  const [limit, setLimit] = useState(PAGE)

  // Чипы раньше были декоративными: подсвечивались, но список не менялся.
  // Теперь это настоящий фильтр по знаку суммы, как в выписке.
  const listed = useMemo(() => {
    if (filter === 1) return accountOperations.filter((o) => o.amount < 0)
    if (filter === 2) return accountOperations.filter((o) => o.amount > 0)
    return accountOperations
  }, [filter])

  const shown = listed.slice(0, limit)
  const groups = groupOps(shown, true)

  const pickFilter = (idx) => {
    setFilter(idx)
    setLimit(PAGE)
  }

  return (
    <Screen tabbar>
      <NavHeader
        title="Black · 7711"
        back="/home"
        right={
          <>
            <button className="ic-btn ghost" onClick={toggleBalance} aria-label="Скрыть баланс">
              <Icon name="eye" size={22} />
            </button>
            <button className="ic-btn ghost" aria-label="Настройки карты">
              <Icon name="gear" size={22} />
            </button>
          </>
        }
      />

      <div style={{ padding: '4px 16px 20px' }}>
        <BankCard balance={3558737.15} hidden={hideBalance} cover="image/card-skoltech.png" />
      </div>

      <div className="quick-grid" style={{ marginBottom: 24 }}>
        <QuickAction icon="up" label="Перевод" accent onClick={() => navigate('/transfer')} />
        <QuickAction icon="down" label="Пополнить" onClick={() => navigate('/topup')} />
        <QuickAction icon="doc" label="Реквизиты" />
        <QuickAction icon="snow" label="Заморозить" />
      </div>

      <Section>
        <div className="card pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="pic yellow">
            <Icon name="pct" size={22} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="t-body-m">Кэшбэк за ноябрь</div>
            <div className="t-cap" style={{ marginTop: 2 }}>
              Начислим 5 декабря
            </div>
          </div>
          <div className="t-h3 num pos">1 248 ₽</div>
        </div>
      </Section>

      <Chips items={FILTERS} value={filter} onChange={pickFilter} />

      {groups.map((group) => (
        <div key={group.key}>
          <div className="group-label">{group.title}</div>
          <div className="list inset">
            {group.items.map((o) => (
              <Row
                key={o.id}
                icon={o.icon}
                initials={o.initials}
                color={o.pic}
                title={o.title}
                sub={`${o.category} · ${o.date.split(', ').pop()}`}
                value={money(o.amount, { sign: o.amount > 0 })}
                note={o.cashback ? `+${o.cashback} ₽ кэшбэк` : undefined}
                valueClass={o.amount > 0 ? 'pos' : ''}
                to={`/operation/${o.id}`}
              />
            ))}
          </div>
        </div>
      ))}

      {shown.length < listed.length && (
        <div style={{ padding: '16px 16px 0' }}>
          <button className="btn btn-secondary" onClick={() => setLimit((v) => v + PAGE)}>
            Показать ещё
          </button>
        </div>
      )}

      <div style={{ padding: 16 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/statement')}>
          Вся история
        </button>
      </div>
    </Screen>
  )
}
