import { useState } from 'react'
import { Link } from 'react-router-dom'
import { conciergeReply, type ChatMsg } from '../lib/concierge'
import { uid } from '../lib/cms'
import { useStore } from '../store'
import type { GuestPrefs } from '../types'

const cuisineOpts = ['Indian', 'Italian', 'Asian', 'Continental']
const drinkOpts = ['Whisky', 'Wine', 'Cocktails', 'Beer', 'Non-alcoholic']
const expOpts = ['Romantic', 'Business', 'Family', 'Nightlife', 'Culture', 'Wellness']

export function ConciergePage() {
  const { cms, prefs, setCms, setPrefs } = useStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'concierge',
      text: `Welcome. Three pillars: dine inside Trident, discover Hyderabad, and this desk — connecting the two.\n\nTry: “Where should I take my wife for dinner?”`,
    },
  ])

  function send() {
    const q = input.trim()
    if (!q) return
    setMessages((m) => [...m, { role: 'guest', text: q }, { role: 'concierge', text: conciergeReply(q, cms, prefs) }])
    setCms({
      ...cms,
      requests: [
        { id: uid(), createdAt: new Date().toISOString(), kind: 'concierge', name: `${prefs.title} ${prefs.name}`, detail: q, status: 'new' },
        ...cms.requests,
      ],
    })
    setInput('')
  }

  return (
    <section className="section concierge-layout">
      <div className="panel" style={{ minHeight: 640, display: 'flex', flexDirection: 'column' }}>
        <p className="eyebrow">03 — Concierge</p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 56 }}>Ask as you would at the desk</h1>
        <div className="messages" style={{ flex: 1 }}>
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`} style={{ whiteSpace: 'pre-wrap' }}>
              {m.text.split('**').map((part, idx) => (idx % 2 ? <strong key={idx}>{part}</strong> : <span key={idx}>{part}</span>))}
            </div>
          ))}
        </div>
        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="What would you recommend?" />
          <button className="btn" type="submit">
            Send
          </button>
        </form>
      </div>
      <aside>
        <div className="panel" style={{ marginBottom: 20 }}>
          <p className="eyebrow">Guest preferences</p>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '8px 0 16px' }}>How we remember you</h3>
          <input className="field" value={prefs.title} onChange={(e) => setPrefs({ ...prefs, title: e.target.value })} placeholder="Title" />
          <input className="field" value={prefs.name} onChange={(e) => setPrefs({ ...prefs, name: e.target.value })} placeholder="Name" />
          <ToggleRow label="Cuisine" opts={cuisineOpts} selected={prefs.cuisines} onToggle={(v) => setPrefs(toggle(prefs, 'cuisines', v))} />
          <ToggleRow label="Drinks" opts={drinkOpts} selected={prefs.drinks} onToggle={(v) => setPrefs(toggle(prefs, 'drinks', v))} />
          <ToggleRow label="Experience" opts={expOpts} selected={prefs.experiences} onToggle={(v) => setPrefs(toggle(prefs, 'experiences', v))} />
          <p style={{ marginTop: 16 }}>Budget</p>
          <div className="chip-row">
            {(['₹', '₹₹', '₹₹₹', 'luxury'] as const).map((b) => (
              <button key={b} className={`chip ${prefs.budget === b ? 'active' : ''}`} type="button" onClick={() => setPrefs({ ...prefs, budget: b })}>
                {b === 'luxury' ? 'Luxury' : b}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 16 }}>Distance</p>
          <div className="chip-row">
            {([
              ['hotel', 'Hotel only'],
              ['10', '<10 min'],
              ['20', '<20 min'],
              ['anywhere', 'Anywhere'],
            ] as const).map(([id, label]) => (
              <button key={id} className={`chip ${prefs.distance === id ? 'active' : ''}`} type="button" onClick={() => setPrefs({ ...prefs, distance: id })}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <Link className="btn" to="/evening">
          Build my evening
        </Link>
      </aside>
    </section>
  )
}

function toggle(prefs: GuestPrefs, key: 'cuisines' | 'drinks' | 'experiences', value: string): GuestPrefs {
  const set = new Set(prefs[key])
  if (set.has(value)) set.delete(value)
  else set.add(value)
  return { ...prefs, [key]: [...set] }
}

function ToggleRow({
  label,
  opts,
  selected,
  onToggle,
}: {
  label: string
  opts: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <p>{label}</p>
      <div className="chip-row">
        {opts.map((o) => (
          <button key={o} className={`chip ${selected.includes(o) ? 'active' : ''}`} type="button" onClick={() => onToggle(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
