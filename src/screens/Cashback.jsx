import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Offer } from '../components/cards.jsx'
import { cashbackOffers } from '../data/mock.js'

export default function Cashback() {
  return (
    <Screen>
      <NavHeader title="Кэшбэк и скидки" back="/home" />

      <Section>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 16px' }}>
          {cashbackOffers.map((o) => (
            <Offer key={o.id} {...o} wide />
          ))}
        </div>
      </Section>
    </Screen>
  )
}
