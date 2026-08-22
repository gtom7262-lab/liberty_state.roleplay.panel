import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'

const roles = ['Projektinhaber', 'Stellv. Projektinhaber', 'Projektmanagement', 'Projektverwaltung', 'Stellv. Projektverwaltung', 'Manager', 'Head Developer', 'Senior Developer', 'Developer', 'Junior Developer', 'Community Manager', 'Teamleitung', 'Stellv. Teamleitung', 'Head Administrator', 'Senior Administrator', 'Server Administrator', 'Junior Administrator', 'Senior Moderator', 'Moderator', 'Junior Moderator', 'Senior Supporter', 'Supporter', 'Junior Supporter', 'Fraktionsverwaltungsleitung', 'Fraktionsverwaltung', 'Test Fraktionsverwaltung', 'Analystenleitung', 'Stellv. Analystenleitung', 'Head Analyst', 'Analyst', 'Probe Analyst', 'Leiter der Fraktion', 'Stellv. Leiter der Fraktion', 'Spieler']

export default function Dashboard({ user }) {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.role === 'Projektinhaber') fetch('/api/users').then(response => response.ok ? response.json() : []).then(setUsers)
  }, [user])

  async function updateRole(userId, role) {
    const response = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role }) })
    if (!response.ok) return setMessage('Der Rang konnte nicht gespeichert werden.')
    const updated = await response.json()
    setUsers(current => current.map(item => item.id === updated.id ? updated : item))
    setMessage('Rang gespeichert.')
  }

  if (!user) return <main className="content-area"><h1>Kein Zugriff</h1></main>
  return <main className="content-area"><p className="eyebrow">LIBERTY STATE ADMINISTRATION</p><h1 className="dashboard-title">Forumverwaltung</h1><p>Angemeldet als {user.email} · {user.role || 'Spieler'}</p>{user.role !== 'Projektinhaber' ? <p className="permission-note">Nur der Projektinhaber kann Forumränge vergeben.</p> : <section className="thread-panel user-management"><div className="panel-title"><h2>Registrierte Benutzer</h2></div>{users.map(item => <div className="user-row" key={item.id}><span><strong>{item.name || 'Ohne Namen'}</strong><small>{item.email}</small></span><select value={item.role} onChange={event => updateRole(item.id, event.target.value)}>{roles.map(role => <option key={role}>{role}</option>)}</select></div>)}{!users.length && <p className="permission-note">Noch keine registrierten Benutzer vorhanden.</p>}<p className="permission-note">{message}</p></section>}</main>
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session) return { props: { user: null } }
  return { props: { user: session.user } }
}
