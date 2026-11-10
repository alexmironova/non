import { Navigate, useNavigate } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { groupDigits } from '../lib/format.js'

export default function TransferConfirm() {
  const navigate = useNavigate()
  const { transfer } = useApp()
  const { contact, amount, message, from } = transfer

  // Черновик пустой — сюда попали по прямой ссылке или после перезагрузки.
  // Без получателя экрану нечего показывать, возвращаемся к началу перевода.
  if (!contact) return <Navigate to="/transfer" replace />

  return (
    <Screen cta>
      <NavHeader title="Подтверждение" back="/transfer" />

      <div style={{ textAlign: 'center', padding: '8px 24px 24px' }}>
        <span className={`avatar s72 ${contact.color}`} style={{ margin: '0 auto' }}>
          {contact.initials}
        </span>
        <div className="t-cap" style={{ marginTop: 16 }}>
          Перевод получателю
        </div>
        <div className="t-h2" style={{ marginTop: 4 }}>
          {contact.fullName}
        </div>
        <div className="t-display num" style={{ marginTop: 16 }}>
          {groupDigits(amount)} ₽
        </div>
      </div>

      <Section>
        <div className="list">
          <Row icon="card" color="black" title="Счёт списания" value={from.title} />
          <Row icon="phone" color="blue" title="Телефон" value={contact.phone} />
          <Row icon="wallet" color="gray" title="Банк получателя" value={contact.bank} />
          <Row icon="pct" color="green" title="Комиссия" value="Без комиссии" valueClass="pos" />
          {message && <Row icon="chat" color="purple" title="Сообщение" value={message} />}
        </div>
      </Section>

      <Section>
        <div className="card pad" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span className="pic gray" style={{ width: 32, height: 32 }}>
            <Icon name="shield" size={18} />
          </span>
          <p className="t-cap">
            Проверьте имя получателя. Переводы по номеру телефона отменить нельзя —
            деньги придут мгновенно.
          </p>
        </div>
      </Section>

      <div className="sticky-cta">
        <button className="btn btn-primary" onClick={() => navigate('/transfer/success')}>
          Перевести {groupDigits(amount)} ₽
        </button>
      </div>
    </Screen>
  )
}
