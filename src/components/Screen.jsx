import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'

/** Каркас экрана. Статус-бар сознательно не рисуем: на телефоне сверху
 *  должен быть настоящий статус-бар браузера, как в обычном вебе. */
export function Screen({ children, tabbar = false, cta = false, className = '' }) {
  const pad = [tabbar && 'has-tabbar', cta && 'has-cta'].filter(Boolean).join(' ')
  return (
    <div className={`screen ${className}`}>
      <div className={`screen-content ${pad}`}>{children}</div>
    </div>
  )
}

/** Шапка с кнопкой «назад». back=-1 возвращает в предыдущий экран истории. */
export function NavHeader({ title, back = -1, right = null, sticky = true }) {
  const navigate = useNavigate()
  return (
    <header className={`nav-head${sticky ? ' sticky' : ''}`}>
      <button
        className="ic-btn ghost"
        onClick={() => navigate(back)}
        aria-label="Назад"
      >
        <Icon name="back" />
      </button>
      {title && <span className="nh-title">{title}</span>}
      <span className="nh-spacer" />
      {right}
    </header>
  )
}

export function Section({ title, link, onLink, children, flush = false }) {
  return (
    <section className={`section${flush ? ' flush' : ''}`}>
      {(title || link) && (
        <div className="section-head">
          {title && <h2>{title}</h2>}
          {link && (
            <button className="link" onClick={onLink}>
              {link}
              <Icon name="chev" size={18} />
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
