import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'

/** Квадратная плашка слева в строке: иконка или инициалы */
export function Pic({ icon, initials, color = '', rounded = false }) {
  return (
    <span className={`pic ${color}${rounded ? ' rounded' : ''}`}>
      {icon ? <Icon name={icon} size={22} /> : initials}
    </span>
  )
}

/**
 * Универсальная строка списка. Один компонент на продукты, операции,
 * настройки и активы — меняются только плашка и правая часть.
 */
export function Row({
  icon, initials, color = '', rounded = false,
  title, sub, value, note, valueClass = '',
  chevron = false, right = null, to, onClick,
}) {
  const navigate = useNavigate()
  const handle = onClick ?? (to ? () => navigate(to) : undefined)
  const Tag = handle ? 'button' : 'div'

  return (
    <Tag className="row" onClick={handle} type={handle ? 'button' : undefined}>
      <Pic icon={icon} initials={initials} color={color} rounded={rounded} />
      <span className="row-txt">
        <span className="row-title">{title}</span>
        {sub && <span className="row-sub">{sub}</span>}
      </span>
      {(value || note) && (
        <span className="row-val">
          {value && <span className={`row-amount num ${valueClass}`}>{value}</span>}
          {note && <span className="row-note">{note}</span>}
        </span>
      )}
      {right}
      {chevron && (
        <span className="chevron">
          <Icon name="chev" size={20} />
        </span>
      )}
    </Tag>
  )
}
