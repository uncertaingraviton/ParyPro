import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { conciergeReply, type ChatMsg } from '../lib/concierge'
import { uid } from '../lib/cms'
import { useStore } from '../store'

export function AskDrawer({
  open,
  onClose,
  seed,
}: {
  open: boolean
  onClose: () => void
  seed?: string
}) {
  const { cms, prefs, setCms } = useStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'concierge',
      text: `Good evening. I am the concierge for Trident, Hyderabad.\n\nAsk me for a table, a city, or a night. I will answer as if I were standing at the desk.`,
    },
  ])
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open && seed) {
      setInput(seed)
    }
  }, [open, seed])

  if (!open) return null

  function send(text = input) {
    const q = text.trim()
    if (!q) return
    const reply = conciergeReply(q, cms, prefs)
    setMessages((m) => [...m, { role: 'guest', text: q }, { role: 'concierge', text: reply }])
    setCms({
      ...cms,
      requests: [
        {
          id: uid(),
          createdAt: new Date().toISOString(),
          kind: 'concierge',
          name: `${prefs.title} ${prefs.name}`,
          detail: q,
          status: 'new',
        },
        ...cms.requests,
      ],
    })
    setInput('')
  }

  return (
    <div className="drawer" onClick={onClose} role="presentation">
      <div />
      <aside className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow">The Concierge</p>
        <h2 className="display" style={{ fontSize: 48, margin: '8px 0 0' }}>
          Ask
        </h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Your guide to the hotel, the table and the city.
        </p>
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`} style={{ whiteSpace: 'pre-wrap' }}>
              {m.text.split('**').map((part, idx) =>
                idx % 2 ? <strong key={idx}>{part}</strong> : <span key={idx}>{part}</span>,
              )}
            </div>
          ))}
          <div ref={end} />
        </div>
        <div className="chip-row" style={{ marginBottom: 16 }}>
          {['Where can I get the best biryani tonight?', "I'm looking for a lively evening.", "I'm bored."].map(
            (s) => (
              <button key={s} className="chip" type="button" onClick={() => send(s)}>
                {s}
              </button>
            ),
          )}
        </div>
        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you recommend?"
            aria-label="Ask the concierge"
          />
          <button className="btn" type="submit">
            Send
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16, fontSize: 12 }}>
          Prefer a full page? <Link to="/concierge">Open the concierge desk</Link>
        </p>
      </aside>
    </div>
  )
}
