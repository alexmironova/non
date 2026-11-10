import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Sheet } from '../components/Overlays.jsx'
import { AmountField, Keypad, applyKey } from '../components/controls.jsx'
import { useApp } from '../state/AppState.jsx'
import { money, groupDigits } from '../lib/format.js'
import { accounts, topupCards } from '../data/mock.js'

export default function Topup() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [to, setTo] = useState(accounts[0])
  const [card, setCard] = useState(topupCards[0])
  const [amount, setAmount] = useState('')
  const [picking, setPicking] = useState(null)

  const value = Number(amount || 0)
  const ready = value > 0

  const send = () => {
    showToast(`Пополнено на ${groupDigits(amount)} ₽`)
    navigate('/home')
  }

  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <NavHeader title="Пополнить" />

        <div className="list inset">
          <Row
            icon={card.icon}
            color={card.color}
            title={card.title}
            sub={card.sub}
            value="Откуда"
            chevron
            onClick={() => setPicking('card')}
          />
        </div>

        <div className="swap-row">
          <span className="swap-dash" />
        </div>

        <div className="list inset" style={{ marginBottom: 8 }}>
          <Row
            icon={to.glyph ? undefined : to.icon}
            initials={to.glyph}
            color={to.pic}
            title={to.title}
            sub={`Сейчас ${money(to.amount)}`}
            value="Куда"
            chevron
            onClick={() => setPicking('account')}
          />
        </div>

        <AmountField
          amount={amount}
          onChange={setAmount}
          hint="Без комиссии · зачислим за пару минут"
          presets={['1000', '3000', '5000', '10000']}
        />

        <div style={{ flex: 1, minHeight: 8 }} />

        <Keypad onKey={(k) => setAmount((v) => applyKey(v, k))} />

        <div style={{ padding: '0 16px calc(16px + var(--safe-bottom))' }}>
          <button className="btn btn-primary" disabled={!ready} onClick={send}>
            {value > 0 ? `Пополнить на ${groupDigits(amount)} ₽` : 'Пополнить'}
          </button>
        </div>
      </div>

      {picking === 'card' && (
        <Sheet title="Откуда пополнить" onClose={() => setPicking(null)}>
          <div className="list">
            {topupCards.map((c) => (
              <Row
                key={c.id}
                icon={c.icon}
                color={c.color}
                title={c.title}
                sub={c.sub}
                onClick={() => {
                  setCard(c)
                  setPicking(null)
                }}
              />
            ))}
            <Row
              icon="plus"
              color="gray"
              title="Другая карта"
              sub="Понадобится номер и срок"
              onClick={() => showToast('Привязка карты — экрана пока нет')}
            />
          </div>
        </Sheet>
      )}

      {picking === 'account' && (
        <Sheet title="Куда зачислить" onClose={() => setPicking(null)}>
          <div className="list">
            {accounts.map((a) => (
              <Row
                key={a.id}
                icon={a.glyph ? undefined : a.icon}
                initials={a.glyph}
                color={a.pic}
                title={a.title}
                sub={money(a.amount)}
                onClick={() => {
                  setTo(a)
                  setPicking(null)
                }}
              />
            ))}
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
