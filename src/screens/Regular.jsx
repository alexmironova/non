import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import Icon from '../components/Icon.jsx'
import { useApp } from '../state/AppState.jsx'
import { autopayments } from '../data/mock.js'

export default function Regular() {
  const { showToast } = useApp()

  return (
    <Screen>
      <NavHeader
        title="Регулярные"
        right={
          <button
            className="ic-btn ghost"
            aria-label="Добавить"
            onClick={() => showToast('Новый регулярный платёж — экрана пока нет')}
          >
            <Icon name="plus" size={22} />
          </button>
        }
      />

      <Section>
        <div className="list">
          {autopayments.map((a) => (
            <Row
              key={a.id}
              icon={a.icon}
              color={a.color}
              title={a.title}
              sub={a.sub}
              value={a.value}
              chevron
              onClick={() => showToast('Настройки платежа — экрана пока нет')}
            />
          ))}
        </div>
      </Section>

      <div className="group-label">
        Платежи списываются автоматически. Отключить можно в любой момент.
      </div>
    </Screen>
  )
}
