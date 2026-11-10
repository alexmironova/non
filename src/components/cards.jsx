import { useState } from 'react'
import Icon from './Icon.jsx'
import { money } from '../lib/format.js'
import { asset } from '../lib/asset.js'

/**
 * Фоновая картинка карточки. Если файла в public/img/ нет, элемент
 * убирает себя сам и остаётся градиентная подложка — экран не ломается,
 * пока оригиналы не подставлены.
 */
function Cover({ src, alt = '', onFail }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null
  return (
    <img
      className="cover-img"
      src={asset(src)}
      alt={alt}
      loading="lazy"
      onError={() => {
        setFailed(true)
        onFail?.()
      }}
    />
  )
}

/**
 * Пластик на экране карты.
 *
 * `cover` — готовый арт из public/image/. На нём уже напечатаны логотип,
 * бесконтактная метка, чип и платёжная система, поэтому свои рисовать
 * поверх нельзя: задвоятся. Срок действия тоже убираем — в арте его угол
 * занят логотипом МИР. Остаются номер и баланс: их в арте нет, они у
 * каждого свои.
 */
export function BankCard({ variant = 'black', number = '•• 7711', balance, expires = '10/29', hidden = false, cover }) {
  const [broken, setBroken] = useState(false)
  const art = Boolean(cover) && !broken

  return (
    <div className={`bank-card ${variant}${art ? ' art' : ''}`}>
      {art && (
        <img className="bc-art" src={asset(cover)} alt="" onError={() => setBroken(true)} />
      )}
      {!art && (
        <div className="bc-top">
          <span className="bc-logo">Т</span>
          <Icon name="contactless" size={22} />
        </div>
      )}
      <div className="bc-foot">
        <div className="bc-num">{number}</div>
        <div className="bc-row">
          <span className="bc-bal num">{hidden ? '•• ••• ₽' : money(balance)}</span>
          {!art && (
            <span className="t-cap" style={{ color: 'rgba(255,255,255,.6)' }}>
              {expires}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function Banner({ icon, title, text, variant = '', onClick }) {
  return (
    <button className={`banner ${variant}`} onClick={onClick}>
      <span className="pic" style={{ background: 'rgba(0,0,0,.08)', color: 'inherit' }}>
        <Icon name={icon} size={22} />
      </span>
      <span className="banner-txt">
        <h3>{title}</h3>
        <p>{text}</p>
      </span>
    </button>
  )
}

/**
 * Квадратная сторис. У готового арта подпись и иконка уже внутри картинки —
 * рисовать их поверх значило бы задвоить текст, поэтому наложения
 * включаются только в запасном виде, когда картинки нет или она не открылась.
 *
 * Не кнопка, а блок: лента только показывает плитки, нажатие не обрабатывает.
 * Подпись для скринридера даёт `alt` у картинки.
 */
export function Story({ g, icon, title, cover }) {
  const [broken, setBroken] = useState(false)
  const art = Boolean(cover) && !broken

  return (
    <div className={`story ${g}${art ? ' art' : ''}`}>
      <Cover src={cover} alt={title} onFail={() => setBroken(true)} />
      {!art && (
        <>
          <span className="ring">
            <Icon name={icon} size={15} stroke={2} />
          </span>
          <span>{title}</span>
        </>
      )}
    </div>
  )
}

export function Offer({ g, cashback, title, sub, cover, wide = false, onClick }) {
  return (
    <button
      className="offer"
      onClick={onClick}
      style={wide ? { width: 'calc(50% - 4px)' } : undefined}
    >
      <span className={`cover ${g}`}>
        <Cover src={cover} alt={title} />
        <span className="cashback">{cashback}</span>
      </span>
      <span className="ob">
        <h4>{title}</h4>
        <p>{sub}</p>
      </span>
    </button>
  )
}
