import Icon from './Icon.jsx'
import { useApp } from '../state/AppState.jsx'

/** Короткая подсказка внизу экрана — для кнопок без своего экрана. */
export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div className="toast" role="status">
      {toast}
    </div>
  )
}

/**
 * Шторка снизу. Используется там, где выбор не заслуживает отдельного
 * экрана: открылась, забрали значение, закрылась.
 */
export function Sheet({ title, onClose, children }) {
  return (
    <>
      <div className="sheet-back" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={title}>
        <span className="sheet-grip" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="ic-btn ghost" onClick={onClose} aria-label="Закрыть">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  )
}

/** Имитация сканера QR: камеры в прототипе нет, показываем рамку наведения. */
export function QrScanner({ onClose }) {
  return (
    <div className="viewer qr-view">
      <button className="viewer-close" onClick={onClose} aria-label="Закрыть">
        <Icon name="close" size={24} stroke={2.2} />
      </button>
      <div className="qr-frame">
        <Icon name="qr" size={96} stroke={1.2} />
      </div>
      <p className="qr-hint">Наведите камеру на QR-код</p>
    </div>
  )
}
