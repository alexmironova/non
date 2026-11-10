import { useState } from 'react'
import { groupDigits } from '../lib/format.js'
import Icon from './Icon.jsx'

/**
 * Чипы-фильтры. По умолчанию активный индекс живёт внутри — так они стоят
 * на экранах-витринах. Если передать `value` и `onChange`, компонент
 * становится управляемым: это нужно там, где выбор реально фильтрует данные
 * (выписка), а наружу индекс иначе не достать.
 */
export function Chips({ items, initial = 0, value, onChange, className = '' }) {
  const [inner, setInner] = useState(initial)
  const controlled = value !== undefined
  const active = controlled ? value : inner

  const pick = (idx) => {
    if (!controlled) setInner(idx)
    onChange?.(idx)
  }

  return (
    <div className={`chips ${className}`}>
      {items.map((item, idx) => (
        <button
          key={typeof item === 'string' ? item : item.key}
          className={`chip${idx === active ? ' active' : ''}`}
          onClick={() => pick(idx)}
        >
          {typeof item === 'string' ? item : item.label}
        </button>
      ))}
    </div>
  )
}

/** Переключатель-сегменты. Управляемый режим — как у `Chips`. */
export function Segmented({ items, initial = 0, value, onChange }) {
  const [inner, setInner] = useState(initial)
  const controlled = value !== undefined
  const active = controlled ? value : inner

  const pick = (idx) => {
    if (!controlled) setInner(idx)
    onChange?.(idx)
  }

  return (
    <div className="segmented">
      {items.map((label, idx) => (
        <button
          key={label}
          className={idx === active ? 'active' : ''}
          onClick={() => pick(idx)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function Switch({ initial = false }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      className={`switch${on ? ' on' : ''}`}
      onClick={() => setOn((v) => !v)}
      role="switch"
      aria-checked={on}
      aria-label="Переключатель"
    />
  )
}

export function QuickAction({ icon, label, accent = false, onClick }) {
  return (
    <button className="quick" onClick={onClick}>
      <span className={`qi${accent ? ' yellow' : ''}`}>
        <Icon name={icon} />
      </span>
      <span className="ql">{label}</span>
    </button>
  )
}

/**
 * Быстрое действие на главном: широкая плашка с иконкой и подпись под ней
 * в две строки. Отличается от `QuickAction` формой — та квадратная и живёт
 * на экране карты.
 */
export function ActionTile({ icon, label, onClick }) {
  return (
    <button className="act" onClick={onClick}>
      <span className="act-tile">
        <Icon name={icon} size={26} />
      </span>
      <span className="act-lab">{label}</span>
    </button>
  )
}

/**
 * Ввод суммы: крупное число, подсказка и быстрые суммы. Клавиатура не
 * входит сюда намеренно — она прижата к низу экрана, а поле стоит вверху.
 */
export function AmountField({ amount, onChange, hint, presets = ['500', '1000', '3000', '5000'] }) {
  return (
    <>
      <div className="amount-input">
        <div className="val num">
          {groupDigits(amount)} <span className="cur">₽</span>
        </div>
        <div className="hint">{hint}</div>
      </div>

      <div className="chips" style={{ justifyContent: 'center', paddingBottom: 16 }}>
        {presets.map((p) => (
          <button
            key={p}
            className={`chip${amount === p ? ' active' : ''}`}
            onClick={() => onChange(p)}
          >
            {groupDigits(p)} ₽
          </button>
        ))}
      </div>
    </>
  )
}

/** Нажатие цифровой клавиши поверх текущей суммы. */
export function applyKey(amount, key) {
  if (key === 'del') return amount.slice(0, -1)
  if (amount.length >= 9) return amount
  return amount === '0' ? key : amount + key
}

/**
 * Цифровая клавиатура. Своя, а не системная — так приложение управляет
 * раскладкой и не зависит от клавиатуры ОС.
 */
export function Keypad({ onKey, leftKey = null }) {
  return (
    <div className="keypad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button key={n} className="key" onClick={() => onKey(String(n))}>
          {n}
        </button>
      ))}
      {leftKey ?? <span className="key flat" />}
      <button className="key" onClick={() => onKey('0')}>
        0
      </button>
      <button
        className="key flat"
        onClick={() => onKey('del')}
        aria-label="Удалить"
      >
        <Icon name="backspace" size={26} />
      </button>
    </div>
  )
}
