import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, NavHeader } from '../components/Screen.jsx'
import { Keypad } from '../components/controls.jsx'
import Icon from '../components/Icon.jsx'
import { user } from '../data/mock.js'

export default function Pin() {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')

  // Как в банковском приложении: код введён — сразу пускаем внутрь
  useEffect(() => {
    if (pin.length === 4) {
      const t = setTimeout(() => navigate('/home'), 220)
      return () => clearTimeout(t)
    }
  }, [pin, navigate])

  const handleKey = (k) =>
    setPin((p) => (k === 'del' ? p.slice(0, -1) : p.length < 4 ? p + k : p))

  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <NavHeader
          back="/"
          title=""
          right={
            <button className="ic-btn ghost" aria-label="Поддержка">
              <Icon name="head" />
            </button>
          }
        />

        <div style={{ textAlign: 'center', padding: '16px 32px 0' }}>
          <span className="avatar s64" style={{ margin: '0 auto' }}>
            {user.initials}
          </span>
          <h2 className="t-h2" style={{ margin: '16px 0 6px' }}>
            {user.name}
          </h2>
          <p className="t-sub">Введите код доступа</p>
        </div>

        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className={i < pin.length ? 'on' : ''} />
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />

        <Keypad
          onKey={handleKey}
          leftKey={
            <button className="key flat" aria-label="Face ID" onClick={() => navigate('/home')}>
              <Icon name="faceid" size={26} stroke={1.6} />
            </button>
          }
        />

        <div style={{ textAlign: 'center', padding: '0 24px calc(16px + var(--safe-bottom))' }}>
          <button className="btn btn-ghost sm">Не помню код</button>
        </div>
      </div>
    </Screen>
  )
}
