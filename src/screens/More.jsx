import { useNavigate } from 'react-router-dom'
import { Screen, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Switch } from '../components/controls.jsx'
import Icon from '../components/Icon.jsx'
import { user } from '../data/mock.js'

export default function More() {
  const navigate = useNavigate()

  return (
    <Screen tabbar>
      <header className="app-head">
        <span className="t-h2" style={{ flex: 1 }}>
          Профиль
        </span>
        <button
          className="ic-btn"
          aria-label="Настройки"
          onClick={() => navigate('/more/settings')}
        >
          <Icon name="gear" size={22} />
        </button>
      </header>

      <Section>
        <button
          className="card pad"
          style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left' }}
          onClick={() => navigate('/more/profile')}
        >
          <span className="avatar s48">{user.initials}</span>
          <span style={{ flex: 1 }}>
            <span className="t-h3" style={{ display: 'block' }}>
              {user.fullName}
            </span>
            <span className="t-cap" style={{ display: 'block', marginTop: 2 }}>
              {user.phone} · {user.plan}
            </span>
          </span>
          <span className="chevron">
            <Icon name="chev" size={20} />
          </span>
        </button>
      </Section>

      <Section>
        <div className="list">
          <Row icon="card" color="black" title="Карты и счета" sub="3 продукта" chevron to="/card" />
          <Row icon="gift" color="yellow" title="Бонусы и кэшбэк" sub="1 248 ₽ за ноябрь" chevron to="/more/bonuses" />
          <Row icon="doc" color="blue" title="Справки и выписки" chevron to="/more/statements" />
        </div>
      </Section>

      <div className="group-label">Безопасность</div>
      <Section>
        <div className="list">
          <Row icon="lock" color="green" title="Код доступа и Face ID" sub="Включены" chevron to="/more/security" />
          <Row icon="shield" color="red" title="Лимиты и ограничения" sub="Платежи, снятие, интернет" chevron to="/more/limits" />
          <Row icon="bell" color="orange" title="Уведомления" sub="Push, SMS, e-mail" chevron to="/more/notifications" />
        </div>
      </Section>

      <div className="group-label">Приложение</div>
      <Section>
        <div className="list">
          <Row icon="moon" color="gray" title="Тёмная тема" sub="Включена" right={<Switch initial />} />
          <Row icon="cat" color="gray" title="Главный экран" sub="Порядок продуктов и виджетов" chevron to="/more/layout" />
          <Row icon="head" color="gray" title="Помощь и поддержка" chevron to="/chat" />
        </div>
      </Section>

      <Section>
        <div className="list">
          <Row icon="doc" color="gray" title="Правовые документы" chevron to="/more/legal" />
          <Row
            icon="out"
            color="red"
            title={<span style={{ color: 'var(--red)' }}>Выйти</span>}
            onClick={() => navigate('/')}
          />
        </div>
      </Section>

      <p className="t-cap" style={{ textAlign: 'center', padding: '4px 0 24px' }}>
        Версия 7.42.0 (3180)
      </p>
    </Screen>
  )
}
