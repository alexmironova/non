import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen.jsx'
import Icon from '../components/Icon.jsx'

export default function Login() {
  const navigate = useNavigate()
  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <div style={{ padding: 'var(--head-top) 24px 8px' }}>
          <div className="hero-logo">Т</div>
          <h1 className="t-h1" style={{ margin: '24px 0 6px' }}>
            Вход в Т-Банк
          </h1>
          <p className="t-sub">Введите номер телефона, привязанный к счёту</p>
        </div>

        <div
          className="field"
          style={{ margin: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <span className="t-body-m" style={{ color: 'var(--text-2)' }}>
            +7
          </span>
          <input
            type="tel"
            inputMode="tel"
            defaultValue="925 925-65-45"
            aria-label="Номер телефона"
          />
        </div>

        <p className="t-cap" style={{ padding: '10px 28px 0' }}>
          Нажимая «Продолжить», вы соглашаетесь с{' '}
          <span style={{ color: 'var(--blue)' }}>условиями обслуживания</span>
        </p>

        <div style={{ flex: 1, minHeight: 24 }} />

        <div style={{ padding: '0 24px calc(24px + var(--safe-bottom))' }}>
          <button className="btn btn-primary" onClick={() => navigate('/pin')}>
            Продолжить
          </button>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 4 }}
            onClick={() => navigate('/home')}
          >
            <Icon name="faceid" size={20} />
            Войти по Face ID
          </button>
        </div>
      </div>
    </Screen>
  )
}
