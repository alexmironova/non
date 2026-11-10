import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { bills, favContacts, promoCard } from '../data/mock.js'

export default function Payments() {
  const navigate = useNavigate()
  const { setTransfer, showToast } = useApp()
  const [promoGone, setPromoGone] = useState(false)

  const pick = (contact) => {
    setTransfer((t) => ({ ...t, contact }))
    navigate('/transfer')
  }

  return (
    <Screen tabbar>
      <header className="big-head">
        <h1>Платежи</h1>
      </header>

      <button className="search-box" onClick={() => showToast('Поиск — экрана пока нет')}>
        <Icon name="search" size={20} />
        <span>Поиск</span>
      </button>

      <div className="pay-duo">
        <button className="pay-btn" onClick={() => navigate('/bills')}>
          <span className="pb-ic">
            <Icon name="doc" size={22} />
          </span>
          На оплату
          <span className="pb-badge">{bills.length}</span>
        </button>
        <button className="pay-btn" onClick={() => navigate('/regular')}>
          <span className="pb-ic">
            <Icon name="repeat" size={22} />
          </span>
          Регулярные
        </button>
      </div>

      <Section>
        <div className="card pad">
          <div className="card-head">
            <h2>Перевод по телефону</h2>
          </div>
          <button className="phone-field" onClick={() => navigate('/transfer')}>
            Введите номер или имя
          </button>
          <div className="pick-row">
            <button className="round-act" onClick={() => navigate('/transfer')}>
              <span className="ra-ic">
                <Icon name="user" size={26} />
              </span>
              <span className="ra-lab">Контакты</span>
            </button>
            {favContacts.map((c) => (
              <button key={c.id} className="round-act" onClick={() => pick(c)}>
                <span className={`avatar s56 ${c.color}`}>{c.initials}</span>
                <span className="ra-lab">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {!promoGone && (
        <Section>
          <div className="promo" style={{ margin: 0 }}>
            <button className="promo-body" onClick={() => showToast('Оформление карты — экрана пока нет')}>
              <h3>{promoCard.title}</h3>
              <p>{promoCard.text}</p>
            </button>
            <button
              className="promo-x"
              onClick={() => setPromoGone(true)}
              aria-label="Скрыть предложение"
            >
              <Icon name="close" size={16} stroke={2.4} />
            </button>
          </div>
        </Section>
      )}

      <Section>
        <div className="list">
          <Row icon="phone" color="yellow" title="По номеру телефона" sub="В любой банк · без комиссии" chevron to="/transfer" />
          <Row icon="card" color="blue" title="По номеру карты" sub="Зачисление до 5 минут" chevron to="/transfer" />
          <Row icon="doc" color="gray" title="По реквизитам" sub="Юрлицу или ИП" chevron />
          <Row icon="repeat" color="green" title="Между своими счетами" sub="3 счёта и карты" chevron to="/between" />
        </div>
      </Section>
    </Screen>
  )
}
