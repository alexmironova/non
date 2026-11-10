import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { QuickAction, Chips } from '../components/controls.jsx'
import { BankCard } from '../components/cards.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { platinumOperations } from '../data/mock.js'

export default function CardPlatinum() {
  const navigate = useNavigate()
  const { hideBalance, toggleBalance } = useApp()
  const recent = platinumOperations
  const days = [...new Set(recent.map((o) => o.day))]

  return (
    <Screen tabbar>
      <NavHeader
        title="Platinum · 7788"
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
        <BankCard variant="platinum" number="•• 7788" balance={12300} expires="04/28" hidden={hideBalance} />
      </div>

      <div className="quick-grid" style={{ marginBottom: 24 }}>
        <QuickAction icon="up" label="Погасить" accent onClick={() => navigate('/transfer')} />
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
            <div className="t-body-m">Платёж по кредитке</div>
            <div className="t-cap" style={{ marginTop: 2 }}>
              Погасить до 28 ноября
            </div>
          </div>
          <div className="t-h3 num">12 300 ₽</div>
        </div>
      </Section>

      <Chips items={['Все операции', 'Расходы', 'Поступления']} />

      {days.map((day) => (
        <div key={day}>
          <div className="group-label">{day}</div>
          <div className="list inset">
            {recent
              .filter((o) => o.day === day)
              .map((o) => (
                <Row
                  key={o.id}
                  icon={o.icon}
                  initials={o.initials}
                  color={o.pic}
                  title={o.title}
                  sub={`${o.category} · ${o.date.split(', ')[1]}`}
                  value={money(o.amount, { sign: o.amount > 0 })}
                  note={o.cashback ? `+${o.cashback} ₽ кэшбэк` : undefined}
                  valueClass={o.amount > 0 ? 'pos' : ''}
                  to={`/operation/${o.id}`}
                />
              ))}
          </div>
        </div>
      ))}

      <div style={{ padding: 16 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/statement')}>
          Вся история
        </button>
      </div>
    </Screen>
  )
}
