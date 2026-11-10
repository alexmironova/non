import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Section } from '../components/Screen.jsx'
import { QrScanner } from '../components/Overlays.jsx'
import { ActionTile } from '../components/controls.jsx'
import { Story, Offer } from '../components/cards.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { asset } from '../lib/asset.js'
import {
  user, accounts, stories, offers, brands, promo, monthSpent,
} from '../data/mock.js'

/** Карточка продукта: кружок, сумма, название, плашка и миниатюра пластика. */
function AccountCard({ a, hidden, onClick }) {
  return (
    <button className="acct" onClick={onClick}>
      <span className={`acct-ic ${a.pic}`}>
        {a.glyph ?? <Icon name={a.icon} size={24} />}
      </span>
      <span>
        <span className="acct-sum num">{hidden ? '•• ••• ₽' : money(a.amount)}</span>
        <span className="acct-name">{a.title}</span>
      </span>
      {a.chip && <span className="acct-chip">{a.chip}</span>}
      {a.card4 && (
        <span className={`acct-mini ${a.cardTone ?? ''}${a.cover ? ' art' : ''}`}>
          {a.cover && <img className="acct-mini-art" src={asset(a.cover)} alt="" />}
          <span className="acct-mini-num">{a.card4}</span>
        </span>
      )}
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { hideBalance, showToast } = useApp()

  // Включённый сканер и скрытый баннер — состояние экрана, в глобальное
  // класть нечего: за пределами главной оно не нужно.
  const [scanning, setScanning] = useState(false)

  // Подарки в шапке и карточка «Кэшбэк и бонусы» ведут в одно место —
  // держим переход одной функцией, чтобы они не разъехались.
  const openBonuses = () => navigate('/analytics')
  const [promoGone, setPromoGone] = useState(false)

  return (
    <Screen tabbar>
      <header className="home-head">
        <button className="avatar s40" onClick={() => navigate('/more')}>
          {user.initials}
        </button>
        <button className="home-name" onClick={() => navigate('/more')}>
          {user.name}
          <Icon name="chev" size={22} stroke={2.4} />
        </button>
        <span className="hh-spacer" />
        <button
          className="ic-btn violet"
          aria-label="Подарки"
          onClick={openBonuses}
        >
          <Icon name="gift" size={22} />
        </button>
      </header>

      <button className="search-box" onClick={() => navigate('/payments')}>
        <Icon name="search" size={20} />
        <span>Поиск</span>
      </button>

      <div className="hscroll stories" style={{ paddingBottom: 20 }}>
        {stories.map((s) => (
          <Story key={s.id} {...s} />
        ))}
      </div>

      <div className="duo">
        <button className="duo-card" onClick={() => navigate('/statement')}>
          <h3>Все операции</h3>
          <span className="dc-sub">
            Трат в ноябре
            <br />
            <span className="num">{money(monthSpent)}</span>
          </span>
          <span className="meter" />
        </button>

        <button className="duo-card" onClick={openBonuses}>
          <h3>
            Кэшбэк
            <br />
            и бонусы
          </h3>
          <span className="dc-badge">1</span>
          <span className="brand-row">
            {brands.map((b) => (
              <span key={b.id} className="brand" style={{ background: b.bg, color: b.fg }}>
                {b.label}
              </span>
            ))}
          </span>
        </button>
      </div>

      <div className="act-grid">
        <ActionTile icon="up" label="Перевести по телефону" onClick={() => navigate('/transfer')} />
        <ActionTile icon="plus" label="Пополнить Black" onClick={() => navigate('/topup')} />
        <ActionTile icon="pay" label="Между счетами" onClick={() => navigate('/between')} />
        <ActionTile icon="qr" label="Сканировать QR-код" onClick={() => setScanning(true)} />
      </div>

      <div className="section">
        {accounts.map((a) => (
          <AccountCard
            key={a.id}
            a={a}
            hidden={hideBalance}
            onClick={() => navigate(a.to ?? '/card')}
          />
        ))}

        {!promoGone && (
          <div className="promo">
            <button
              className="promo-body"
              onClick={() => showToast('Заявка на кредит — экрана пока нет')}
            >
              <h3>{promo.title}</h3>
              <p>{promo.text}</p>
            </button>
            <button
              className="promo-x"
              onClick={() => setPromoGone(true)}
              aria-label="Скрыть предложение"
            >
              <Icon name="close" size={16} stroke={2.4} />
            </button>
          </div>
        )}
      </div>

      <Section title="Кэшбэк и скидки" link="Все" onLink={() => navigate('/cashback')} flush>
        <div className="hscroll">
          {offers.map((o) => (
            <Offer key={o.id} {...o} onClick={() => navigate('/cashback')} />
          ))}
        </div>
      </Section>

      {scanning && <QrScanner onClose={() => setScanning(false)} />}
    </Screen>
  )
}
