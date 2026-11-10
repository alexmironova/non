import { useState } from 'react'
import { Sheet } from './Overlays.jsx'
import Icon from './Icon.jsx'

// Почту проверяем на глаз, без строгой RFC-грамматики: задача — не пустить
// дальше явную опечатку, а не отфильтровать экзотический адрес
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Шторка «прислать документ на почту»: поле адреса, затем подтверждение.
 *
 * Жила внутри выписки, где ею запрашивают PDF. Тем же способом в приложении
 * получают правовые документы, и копия вместо общего компонента означала бы
 * две шторки, которые со временем разойдутся в поведении и в текстах.
 *
 * `what` — что именно пришлют, в именительном падеже («Выписка», «Тарифы»):
 * подставляется и в заголовок, и в подтверждение. `plural` нужен там, где
 * название во множественном числе: «Тарифы придут», а не «Тарифы придёт».
 */
export default function EmailSheet({ what, plural = false, onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const address = email.trim()

  if (sent) {
    return (
      <Sheet title="Запрос отправлен" onClose={onClose}>
        <div style={{ textAlign: 'center', padding: '8px 24px 24px' }}>
          <div className="status-badge">
            <Icon name="check" size={44} stroke={2.4} />
          </div>
          <p className="t-body" style={{ marginTop: 20 }}>
            {what} {plural ? 'придут' : 'придёт'} на {address} в течение двух рабочих дней.
          </p>
        </div>

        <div style={{ padding: '0 var(--gutter) 12px' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Готово
          </button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet title={`${what} на почту`} onClose={onClose}>
      <p className="t-cap" style={{ padding: '0 var(--gutter) 16px' }}>
        Пришлём PDF документ на вашу почту в течение двух рабочих дней.
      </p>

      <div className="field">
        <label htmlFor="email-sheet">Электронная почта</label>
        <input
          id="email-sheet"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ padding: '8px var(--gutter) 12px' }}>
        <button
          className="btn btn-primary"
          disabled={!EMAIL.test(address)}
          onClick={() => setSent(true)}
        >
          Запросить
        </button>
      </div>
    </Sheet>
  )
}
