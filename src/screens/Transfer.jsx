import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Sheet } from '../components/Overlays.jsx'
import { Keypad } from '../components/controls.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money, groupDigits } from '../lib/format.js'
import { contacts } from '../data/mock.js'

const PRESETS = ['500', '1000', '3000', '5000']

export default function Transfer() {
  const navigate = useNavigate()
  const { transfer, setTransfer } = useApp()
  const { contact, amount, message, from } = transfer
  const [picking, setPicking] = useState(false)

  const setAmount = (next) => setTransfer((t) => ({ ...t, amount: next }))

  const handleKey = (k) => {
    if (k === 'del') return setAmount(amount.slice(0, -1))
    if (amount.length >= 9) return
    setAmount(amount === '0' ? k : amount + k)
  }

  const value = Number(amount || 0)
  const enough = value > 0 && value <= from.available
  const ready = enough && Boolean(contact)

  const choose = (c) => {
    setTransfer((t) => ({ ...t, contact: c }))
    setPicking(false)
  }

  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <NavHeader
          title="Перевод"
          back="/payments"
          right={
            <button
              className="ic-btn ghost"
              aria-label="Выбрать контакт"
              onClick={() => setPicking(true)}
            >
              <Icon name="user" size={22} />
            </button>
          }
        />

        <button
          className="field inline pick"
          style={{ marginBottom: 8 }}
          onClick={() => setPicking(true)}
        >
          {contact ? (
            <>
              <span className={`avatar s40 ${contact.color}`}>{contact.initials}</span>
              <span style={{ flex: 1 }}>
                <span className="t-body-m" style={{ display: 'block' }}>
                  {contact.fullName}
                </span>
                <span className="t-cap">
                  {contact.phone} · {contact.bank}
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="avatar s40 gray">
                <Icon name="user" size={20} />
              </span>
              <span style={{ flex: 1 }}>
                <span className="t-body-m" style={{ display: 'block' }}>
                  Выберите получателя
                </span>
                <span className="t-cap">Имя, телефон или карта</span>
              </span>
            </>
          )}
          <span className="chevron">
            <Icon name="chev" size={20} />
          </span>
        </button>

        <div className="amount-input">
          <div className="val num">
            {groupDigits(amount)} <span className="cur">₽</span>
          </div>
          <div className="hint">
            {!enough && value > 0
              ? 'Недостаточно средств на счёте'
              : 'Без комиссии · придёт мгновенно'}
          </div>
        </div>

        <div className="chips" style={{ justifyContent: 'center', paddingBottom: 16 }}>
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`chip${amount === p ? ' active' : ''}`}
              onClick={() => setAmount(p)}
            >
              {groupDigits(p)} ₽
            </button>
          ))}
        </div>

        <div className="list inset" style={{ marginBottom: 8 }}>
          <Row
            icon="card"
            color="black"
            title={from.title}
            sub={`Доступно ${money(from.available)}`}
            value="Откуда"
            chevron
          />
        </div>

        <div className="field">
          <label htmlFor="msg">Сообщение получателю</label>
          <input
            id="msg"
            value={message}
            onChange={(e) => setTransfer((t) => ({ ...t, message: e.target.value }))}
            placeholder="Например, за обед"
          />
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />

        <Keypad onKey={handleKey} />

        <div style={{ padding: '0 16px calc(16px + var(--safe-bottom))' }}>
          <button
            className="btn btn-primary"
            disabled={!ready}
            onClick={() => navigate('/transfer/confirm')}
          >
            {value > 0 ? `Перевести ${groupDigits(amount)} ₽` : 'Перевести'}
          </button>
        </div>
      </div>

      {picking && (
        <Sheet title="Кому перевести" onClose={() => setPicking(false)}>
          <div className="list">
            {contacts.map((c) => (
              <Row
                key={c.id}
                initials={c.initials}
                color={c.color}
                rounded
                title={c.fullName}
                sub={`${c.phone} · ${c.bank}`}
                onClick={() => choose(c)}
              />
            ))}
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
