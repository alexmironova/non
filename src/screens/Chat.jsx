import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen.jsx'
import Icon from '../components/Icon.jsx'
import { chatMessages } from '../data/mock.js'

const REPLIES = ['Вижу, спасибо', 'Пришлите выписку', 'Нужен оператор']

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(chatMessages)
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const send = (text) => {
    const value = (text ?? draft).trim()
    if (!value) return
    setMessages((m) => [
      ...m,
      { id: Date.now(), side: 'out', text: value, time: '14:32' },
    ])
    setDraft('')
  }

  return (
    <Screen>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          paddingBottom: 'calc(var(--tabbar-h) + var(--safe-bottom))',
        }}
      >
        <header
          className="nav-head sticky"
          style={{ borderBottom: '1px solid var(--line)', paddingBottom: 8 }}
        >
          <button className="ic-btn ghost" onClick={() => navigate('/home')} aria-label="Назад">
            <Icon name="back" />
          </button>
          <span className="avatar s40 blue" style={{ marginRight: 10 }}>
            АС
          </span>
          <div style={{ flex: 1 }}>
            <div className="t-body-m">Поддержка Т-Банка</div>
            <div className="t-cap pos">Отвечаем 1–2 минуты</div>
          </div>
          <button className="ic-btn ghost" aria-label="Позвонить">
            <Icon name="phone" size={22} />
          </button>
        </header>

        <div className="chat-body">
          <div className="day-div">Сегодня</div>

          {messages.map((m) =>
            m.side === 'card' ? (
              <button
                key={m.id}
                className="card pad"
                onClick={() => navigate('/operation/op10')}
                style={{ alignSelf: 'flex-start', maxWidth: '78%', display: 'flex', gap: 12, alignItems: 'center' }}
              >
                <span className="pic green">
                  <Icon name="gift" size={22} />
                </span>
                <span style={{ textAlign: 'left' }}>
                  <span className="t-body-m" style={{ display: 'block' }}>
                    Кэшбэк за октябрь
                  </span>
                  <span className="t-cap" style={{ display: 'block', marginTop: 2 }}>
                    5 окт. · + 1 980 ₽
                  </span>
                </span>
              </button>
            ) : (
              <div key={m.id} className={`bubble ${m.side}`}>
                {m.text}
                <div className="time">{m.time}</div>
              </div>
            )
          )}

          <div className="quick-replies">
            {REPLIES.map((r) => (
              <button key={r} className="qr" onClick={() => send(r)}>
                {r}
              </button>
            ))}
          </div>
          <div ref={endRef} />
        </div>

        <div className="composer">
          <button className="ic-btn ghost" style={{ width: 32, height: 32 }} aria-label="Вложение">
            <Icon name="clip" size={22} />
          </button>
          <div className="cf">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Сообщение…"
              aria-label="Сообщение"
            />
          </div>
          {draft ? (
            <button
              className="ic-btn"
              style={{ width: 36, height: 36, background: 'var(--yellow)' }}
              onClick={() => send()}
              aria-label="Отправить"
            >
              <Icon name="send" size={20} />
            </button>
          ) : (
            <button className="ic-btn ghost" style={{ width: 32, height: 32 }} aria-label="Голосовое">
              <Icon name="mic" size={22} />
            </button>
          )}
        </div>
      </div>
    </Screen>
  )
}
