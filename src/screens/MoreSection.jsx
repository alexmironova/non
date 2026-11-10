import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Screen, NavHeader, Section } from '../components/Screen.jsx'
import { Row } from '../components/Row.jsx'
import { Switch } from '../components/controls.jsx'
import { useApp } from '../state/AppState.jsx'
import EmailSheet from '../components/EmailSheet.jsx'
import { moreSections } from '../data/moreSections.js'

/**
 * Любой раздел вкладки «Профиль». Какой именно — берётся из адреса,
 * содержимое описано в `moreSections`. Неизвестный адрес возвращает
 * на «Профиль».
 *
 * Строка с `type: 'mail'` открывает ту же шторку запроса на почту, что
 * кнопка «Сохранить в PDF» в выписке — это один компонент, а не копия.
 */
export default function MoreSection() {
  const { id } = useParams()
  const { showToast } = useApp()
  const section = moreSections[id]
  // Какой документ запрашиваем: null — шторка закрыта
  const [mail, setMail] = useState(null)

  if (!section) return <Navigate to="/more" replace />

  return (
    <Screen>
      <NavHeader title={section.title} />

      {section.hero && (
        <div className="sum-head">
          <div className="value num">{section.hero.value}</div>
          <div className="label" style={{ marginTop: 6 }}>
            {section.hero.caption}
          </div>
        </div>
      )}

      {section.groups.map((group, i) => (
        <div key={group.label ?? i}>
          {group.label && <div className="group-label">{group.label}</div>}
          <Section>
            <div className="list">
              {group.rows.map((r) => (
                <Row
                  key={r.title}
                  icon={r.icon}
                  color={r.color}
                  title={r.title}
                  sub={r.sub}
                  value={r.type === 'switch' ? undefined : r.value}
                  right={r.type === 'switch' ? <Switch initial={r.on} /> : null}
                  chevron={r.type === 'nav' || r.type === 'mail'}
                  to={r.to}
                  onClick={
                    r.type === 'mail'
                      ? () => setMail({ what: r.title, plural: r.plural })
                      : r.type === 'nav' && !r.to
                        ? () => showToast(`${r.title} — экрана пока нет`)
                        : undefined
                  }
                />
              ))}
            </div>
          </Section>
        </div>
      ))}

      {section.note && (
        <p className="t-cap" style={{ padding: '0 var(--gutter) 24px' }}>
          {section.note}
        </p>
      )}

      {mail && (
        <EmailSheet what={mail.what} plural={mail.plural} onClose={() => setMail(null)} />
      )}
    </Screen>
  )
}
