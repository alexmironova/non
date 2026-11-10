import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Chips, Segmented } from '../components/controls.jsx'
import { Banner } from '../components/cards.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { money } from '../lib/format.js'
import { positions } from '../data/mock.js'

export default function Invest() {
  const { hideBalance, toggleBalance } = useApp()

  return (
    <Screen tabbar cta>
      <NavHeader
        title="Инвестиции"
        back="/home"
        right={
          <>
            <button className="ic-btn ghost" onClick={toggleBalance} aria-label="Скрыть сумму">
              <Icon name="eye" size={22} />
            </button>
            <button className="ic-btn ghost" aria-label="Поиск">
              <Icon name="search" size={22} />
            </button>
          </>
        }
      />

      <div className="sum-head">
        <div className="label">Брокерский счёт</div>
        <div className="value num">{hideBalance ? '•• ••• ₽' : money(96740.1)}</div>
        <div className="delta pos">+ 2 280,40 ₽ · +2,4% за день</div>
      </div>

      <Section>
        <div className="card pad">
          <svg width="100%" height="120" viewBox="0 0 320 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="investFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#30D475" stopOpacity=".22" />
                <stop offset="1" stopColor="#30D475" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 92 L40 78 L80 86 L120 54 L160 64 L200 38 L240 46 L280 22 L320 14 L320 120 L0 120 Z"
              fill="url(#investFill)"
            />
            <path
              d="M0 92 L40 78 L80 86 L120 54 L160 64 L200 38 L240 46 L280 22 L320 14"
              fill="none" stroke="#30D475" strokeWidth="2.5" strokeLinejoin="round"
            />
            <circle cx="320" cy="14" r="4" fill="#30D475" />
          </svg>
          <Chips items={['Д', 'Н', 'М', '6М', 'Г', 'Всё']} initial={2} className="chips-chart" />
        </div>
      </Section>

      <Segmented items={['Портфель', 'Каталог', 'Новости']} />

      <Section title="Мои активы" link="Аналитика" flush>
        <div className="list inset">
          {positions.map((p) => (
            <Row
              key={p.id}
              icon={p.icon}
              initials={p.initials}
              color={p.pic}
              title={p.title}
              sub={p.sub}
              value={money(p.amount)}
              note={<span className={p.up ? 'pos' : 'neg'}>{p.delta}</span>}
              chevron
            />
          ))}
        </div>
      </Section>

      <Section>
        <Banner
          icon="gift"
          title="Акции в подарок"
          text="Пополните счёт от 10 000 ₽ и получите до 5 акций"
        />
      </Section>

      <div className="sticky-cta above-tabbar">
        <div className="cta-row">
          <button className="btn btn-primary">Пополнить</button>
          <button className="btn btn-secondary" style={{ width: 52, flex: 'none' }} aria-label="Вывести">
            <Icon name="up" size={22} />
          </button>
        </div>
      </div>
    </Screen>
  )
}
