import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Sheet } from '../components/Overlays.jsx'
import { AmountField, Keypad, applyKey } from '../components/controls.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money, groupDigits } from '../lib/format.js'
import { accounts } from '../data/mock.js'

/** Строка счёта: та же плашка, что и на главной, плюс подпись «Откуда»/«Куда». */
function AccountRow({ a, label, onClick }) {
  return (
    <Row
      icon={a.glyph ? undefined : a.icon}
      initials={a.glyph}
      color={a.pic}
      title={a.title}
      sub={`Доступно ${money(a.amount)}`}
      value={label}
      chevron
      onClick={onClick}
    />
  )
}

export default function Between() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [from, setFrom] = useState(accounts[0])
  const [to, setTo] = useState(accounts[1])
  const [amount, setAmount] = useState('')
  const [picking, setPicking] = useState(null)

  const value = Number(amount || 0)
  const enough = value > 0 && value <= from.amount

  // Счета не должны совпасть: при выборе занятого счёта второй уезжает
  // на первый свободный, а не остаётся дублем
  const choose = (a) => {
    const other = accounts.find((x) => x.id !== a.id)
    if (picking === 'from') {
      setFrom(a)
      if (a.id === to.id) setTo(other)
    } else {
      setTo(a)
      if (a.id === from.id) setFrom(other)
    }
    setPicking(null)
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const send = () => {
    showToast(`Переведено ${groupDigits(amount)} ₽ на «${to.title}»`)
    navigate('/home')
  }

  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <NavHeader title="Между счетами" />

        <div className="list inset">
          <AccountRow a={from} label="Откуда" onClick={() => setPicking('from')} />
        </div>

        <div className="swap-row">
          <button className="ic-btn" onClick={swap} aria-label="Поменять местами">
            <Icon name="repeat" size={20} />
          </button>
        </div>

        <div className="list inset" style={{ marginBottom: 8 }}>
          <AccountRow a={to} label="Куда" onClick={() => setPicking('to')} />
        </div>

        <AmountField
          amount={amount}
          onChange={setAmount}
          hint={
            !enough && value > 0
              ? 'Недостаточно средств на счёте'
              : 'Между своими счетами · мгновенно и без комиссии'
          }
        />

        <div style={{ flex: 1, minHeight: 8 }} />

        <Keypad onKey={(k) => setAmount((v) => applyKey(v, k))} />

        <div style={{ padding: '0 16px calc(16px + var(--safe-bottom))' }}>
          <button className="btn btn-primary" disabled={!enough} onClick={send}>
            {value > 0 ? `Перевести ${groupDigits(amount)} ₽` : 'Перевести'}
          </button>
        </div>
      </div>

      {picking && (
        <Sheet
          title={picking === 'from' ? 'Откуда перевести' : 'Куда перевести'}
          onClose={() => setPicking(null)}
        >
          <div className="list">
            {accounts.map((a) => (
              <Row
                key={a.id}
                icon={a.glyph ? undefined : a.icon}
                initials={a.glyph}
                color={a.pic}
                title={a.title}
                sub={money(a.amount)}
                onClick={() => choose(a)}
              />
            ))}
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
