import { useParams, useNavigate } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { MONTHS_GEN } from '../lib/period.js'
import { accountOperations, platinumOperations, savingsOperations } from '../data/mock.js'

// `accountOperations` — вся выписка по Black, а не только текущий месяц:
// иначе строка выписки за март открывала бы чужую операцию
const allOperations = [...accountOperations, ...platinumOperations, ...savingsOperations]

/** '2026-11-08T03:55' → '8 ноября 2026, 03:55' */
function postedLabel(ts) {
  const d = +ts.slice(8, 10)
  const m = MONTHS_GEN[+ts.slice(5, 7) - 1]
  return `${d} ${m} ${ts.slice(0, 4)}, ${ts.slice(11)}`
}

export default function OperationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const op = allOperations.find((o) => o.id === id) ?? allOperations[0]
  const income = op.amount > 0

  return (
    <Screen cta>
      <NavHeader
        title=""
        right={
          <button className="ic-btn ghost" aria-label="Поделиться">
            <Icon name="share" size={22} />
          </button>
        }
      />

      <div style={{ textAlign: 'center', padding: '8px 24px 24px' }}>
        <span className={`pic ${op.pic}`} style={{ width: 64, height: 64, margin: '0 auto', fontSize: 20, borderRadius: 20 }}>
          {op.icon ? <Icon name={op.icon} size={28} /> : op.initials}
        </span>
        <div className="t-h1 num" style={{ marginTop: 16 }}>
          {money(op.amount, { sign: income })}
        </div>
        <div className="t-body" style={{ marginTop: 6 }}>
          {op.title}
        </div>
        {op.detail && (
          <div className="t-cap" style={{ marginTop: 4 }}>
            {op.detail}
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <span className={`tag ${op.pending ? 'yellow' : 'green'}`}>{op.status}</span>
        </div>
      </div>

      {op.cashback > 0 && (
        <Section>
          <div className="card pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="pic yellow">
              <Icon name="gift" size={22} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="t-body-m">Кэшбэк по операции</div>
              <div className="t-cap" style={{ marginTop: 2 }}>
                Начислим в начале месяца
              </div>
            </div>
            <div className="t-h3 num pos">+{op.cashback} ₽</div>
          </div>
        </Section>
      )}

      <Section>
        <div className="list">
          <Row icon="clock" color="gray" title="Дата" value={op.date} />
          {/* Вторая дата из выписки: банк проводит операцию не в тот же миг,
              и по счёту она встаёт датой обработки */}
          {op.posted && op.posted !== op.ts && (
            <Row icon="check" color="gray" title="Обработано" value={postedLabel(op.posted)} />
          )}
          <Row icon="card" color="black" title="Счёт списания" value={op.card} />
          <Row icon="cat" color="blue" title="Категория" value={op.category} />
          {op.mcc && <Row icon="doc" color="gray" title="MCC-код" value={op.mcc} />}
        </div>
      </Section>

      <Section>
        <div className="list">
          <Row icon="repeat" color="green" title="Повторить операцию" chevron onClick={() => navigate('/transfer')} />
          <Row
            icon="doc"
            color="blue"
            title="Справка об операции"
            chevron
            onClick={() => showToast('Справка по операции — экрана пока нет')}
          />
          <Row icon="head" color="gray" title="Вопрос по операции" chevron onClick={() => navigate('/chat')} />
        </div>
      </Section>

      <div className="sticky-cta">
        <button className="btn btn-primary" onClick={() => navigate('/transfer')}>
          Повторить
        </button>
      </div>
    </Screen>
  )
}
