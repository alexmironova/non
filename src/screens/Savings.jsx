import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { QuickAction } from '../components/controls.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { savingsOperations } from '../data/mock.js'

export default function Savings() {
  const navigate = useNavigate()
  const { hideBalance, toggleBalance } = useApp()
  const recent = savingsOperations
  const days = [...new Set(recent.map((o) => o.day))]

  return (
    <Screen tabbar>
      <NavHeader
        title="Накопительный счёт"
        back="/home"
        right={
          <button className="ic-btn ghost" onClick={toggleBalance} aria-label="Скрыть баланс">
            <Icon name="eye" size={22} />
          </button>
        }
      />

      <div className="sum-head">
        <div className="label">Остаток</div>
        <div className="value num">{hideBalance ? '•• ••• ₽' : money(184000)}</div>
        <div className="delta pos">19% на остаток</div>
      </div>

      <div className="quick-grid" style={{ marginBottom: 24 }}>
        <QuickAction icon="down" label="Пополнить" accent onClick={() => navigate('/topup')} />
        <QuickAction icon="up" label="Снять" onClick={() => navigate('/between')} />
        <QuickAction icon="pay" label="Между счетами" onClick={() => navigate('/between')} />
        <QuickAction icon="doc" label="Реквизиты" />
      </div>

      <Section>
        <div className="card pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="pic green">
            <Icon name="pct" size={22} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="t-body-m">Проценты за ноябрь</div>
            <div className="t-cap" style={{ marginTop: 2 }}>
              Начислим 1 ноября
            </div>
          </div>
          <div className="t-h3 num pos">820 ₽</div>
        </div>
      </Section>

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
                  valueClass={o.amount > 0 ? 'pos' : ''}
                  to={`/operation/${o.id}`}
                />
              ))}
          </div>
        </div>
      ))}
    </Screen>
  )
}
