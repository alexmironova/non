import { Navigate, useNavigate } from 'react-router-dom'
import { Screen, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { groupDigits } from '../lib/format.js'

export default function TransferSuccess() {
  const navigate = useNavigate()
  const { transfer } = useApp()
  const { contact, amount, from } = transfer

  // Черновик пустой — сюда попали по прямой ссылке или после перезагрузки.
  // Без получателя экрану нечего показывать, возвращаемся к началу перевода.
  if (!contact) return <Navigate to="/transfer" replace />

  return (
    <Screen cta>
      <header className="nav-head">
        <span className="nh-spacer" />
        <button className="ic-btn ghost" onClick={() => navigate('/home')} aria-label="Закрыть">
          <Icon name="close" size={24} />
        </button>
      </header>

      <div style={{ textAlign: 'center', padding: '24px 24px 32px' }}>
        <div className="status-badge">
          <Icon name="check" size={44} stroke={2.4} />
        </div>
        <h1 className="t-h1" style={{ marginTop: 24 }}>
          Готово
        </h1>
        <p className="t-sub" style={{ marginTop: 8 }}>
          {groupDigits(amount)} ₽ · {contact.fullName}
        </p>
      </div>

      <Section>
        <div className="list">
          <Row icon="clock" color="gray" title="Дата" value="10 ноября, 14:36" />
          <Row icon="card" color="black" title="Счёт списания" value={from.title} />
          <Row icon="wallet" color="blue" title="Банк получателя" value={contact.bank} />
        </div>
      </Section>

      <Section>
        <div className="list">
          <Row icon="doc" color="blue" title="Квитанция в PDF" chevron />
          <Row icon="share" color="gray" title="Поделиться чеком" chevron />
          <Row icon="repeat" color="green" title="Сделать автоплатёж" chevron />
        </div>
      </Section>

      <div className="sticky-cta">
        <div className="cta-row">
          <button className="btn btn-secondary" onClick={() => navigate('/transfer')}>
            Повторить
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
            На главный
          </button>
        </div>
      </div>
    </Screen>
  )
}
