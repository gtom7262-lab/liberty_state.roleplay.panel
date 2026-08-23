import Link from 'next/link'
import { useState } from 'react'

export default function Register() {
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), email: form.get('email'), password: form.get('password') }) })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      return setError(result.error || 'Registrierung fehlgeschlagen.')
    }
    setDone(true)
  }

  return <main className="site-shell"><section className="content-area auth-page"><p className="eyebrow">LIBERTY STATE ROLEPLAY</p><h1>Account erstellen</h1>{done ? <><p>Registrierung erfolgreich. Du kannst dich jetzt anmelden.</p><Link className="primary-button" href="/api/auth/signin">Anmelden</Link></> : <form className="thread-form register-form" onSubmit={submit}><label>Name<input name="name" required /></label><label>E-Mail<input name="email" type="email" required /></label><label>Passwort<input name="password" type="password" minLength="8" required /></label>{error && <p className="permission-note">{error}</p>}<button className="primary-button" type="submit">Account erstellen <span>→</span></button><Link className="permission-note" href="/">Zurück zur Startseite</Link></form>}</section></main>
}
