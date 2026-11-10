import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { bills, billsPaid } from '../data/mock.js'

export default function Bills() {
  const { showToast } = useApp()

  return (
    <Screen>
      <NavHeader title="На оплату" />

      {bills.map((b) => (
        <Section key={b.id}>
          <div className="card pad">
            <div className="bill-top">
              <span className={`pic ${b.color}`}>
                <Icon name={b.icon} size={22} />
              </span>
              <span className="bill-txt">
                <span className="t-body-m">{b.title}</span>
                <span className="t-cap">{b.sub}</span>
              </span>
            </div>

            <div className="bill-sum num">{money(b.amount)}</div>
            <div className="t-cap">{b.due}</div>

            {b.note && (
              <div style={{ marginTop: 12 }}>
                <span className="tag green">{b.note}</span>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => showToast('Оплата счёта — экрана пока нет')}
            >
              Оплатить {money(b.amount)}
            </button>
          </div>
        </Section>
      ))}

      <Section title="Оплаченные">
        <div className="list">
          {billsPaid.map((b) => (
            <Row
              key={b.id}
              icon={b.icon}
              color={b.color}
              title={b.title}
              sub={b.sub}
              value={money(b.amount)}
              note="Оплачено"
              chevron
              onClick={() => showToast('Квитанция — экрана пока нет')}
            />
          ))}
        </div>
      </Section>
    </Screen>
  )
}
