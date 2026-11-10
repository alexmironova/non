import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'

const TABS = [
  { to: '/home', label: 'Главная', icon: 'home' },
  { to: '/payments', label: 'Платежи', icon: 'pay' },
  { to: '/chat', label: 'Чат', icon: 'chat', dot: true },
  { to: '/more', label: 'Профиль', icon: 'more' },
]

export default function TabBar() {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
        >
          <Icon name={t.icon} size={26} />
          {t.dot && <span className="dot" />}
          <span className="tl">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
