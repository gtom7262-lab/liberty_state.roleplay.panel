import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

const roles = ['Projektinhaber', 'Stellv. Projektinhaber', 'Projektmanagement', 'Projektverwaltung', 'Stellv. Projektverwaltung', 'Manager', 'Head Developer', 'Senior Developer', 'Developer', 'Junior Developer', 'Community Manager', 'Teamleitung', 'Stellv. Teamleitung', 'Head Administrator', 'Senior Administrator', 'Server Administrator', 'Junior Administrator', 'Senior Moderator', 'Moderator', 'Junior Moderator', 'Senior Supporter', 'Supporter', 'Junior Supporter', 'Fraktionsverwaltungsleitung', 'Fraktionsverwaltung', 'Test Fraktionsverwaltung', 'Analystenleitung', 'Stellv. Analystenleitung', 'Head Analyst', 'Analyst', 'Probe Analyst', 'Leiter der Fraktion', 'Stellv. Leiter der Fraktion', 'Spieler']
const roleClass = role => ({ Spieler: 'role-green', 'Stellv. Leiter der Fraktion': 'role-yellow', 'Leiter der Fraktion': 'role-yellow', Fraktionsverwaltungsleitung: 'role-purple', Fraktionsverwaltung: 'role-purple', 'Test Fraktionsverwaltung': 'role-purple', 'Junior Supporter': 'role-green', Supporter: 'role-green', 'Senior Supporter': 'role-green', 'Junior Moderator': 'role-navy', Moderator: 'role-navy', 'Senior Moderator': 'role-navy', 'Junior Administrator': 'role-light-blue', 'Server Administrator': 'role-light-blue', 'Head Administrator': 'role-light-blue', 'Senior Administrator': 'role-neon-purple', 'Stellv. Teamleitung': 'role-dark-green', Teamleitung: 'role-dark-green', 'Community Manager': 'role-light-green', 'Head Developer': 'role-orange', 'Senior Developer': 'role-orange', Developer: 'role-orange', 'Junior Developer': 'role-orange', Manager: 'role-orange-red', Projektmanagement: 'role-orange-red', 'Stellv. Projektverwaltung': 'role-gray', Projektverwaltung: 'role-gray', 'Stellv. Projektinhaber': 'role-red', Projektinhaber: 'role-red' }[role] || 'role-gray')

const sections = [
  { icon: 'F', title: 'Fraktionsbewerbungen', description: 'Bewirb dich für eine Fraktion oder diskutiere offene Bewerbungen.', accent: 'cyan' },
  { icon: 'T', title: 'Team Bewerbungen', description: 'Werde Teil des Teams und unterstütze Liberty State.', accent: 'gold' },
  { icon: 'N', title: 'Ankündigungen', description: 'Alle wichtigen Neuigkeiten aus Liberty State.', accent: 'blue' },
  { icon: 'S', title: 'Support', description: 'Hilfe, Fragen und technische Anliegen.', accent: 'violet' }
]

export default function Home() {
  const { data: session } = useSession()
  const launcherDownloadUrl = process.env.NEXT_PUBLIC_LAUNCHER_DOWNLOAD_URL || 'https://github.com/gtom7262-lab/liberty.state.roleplay.panel/releases/latest/download/liberty-state-launcher.zip'
  const [activeSection, setActiveSection] = useState('Übersicht')
  const [showForm, setShowForm] = useState(false)
  const [threads, setThreads] = useState([])
  const [openThread, setOpenThread] = useState(null)
  const [reply, setReply] = useState('')
  useEffect(() => { fetch('/api/threads').then(response => response.ok ? response.json() : []).then(setThreads) }, [])
  const currentRole = roles.includes(session?.user?.role) ? session.user.role : 'Spieler'

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link className="brand" href="/"><img src="/logo.svg" alt="Liberty State Roleplay" /><span><strong>LIBERTY STATE</strong><small>ROLEPLAY</small></span></Link>
        <nav><button className={activeSection === 'Übersicht' ? 'nav-active' : ''} onClick={() => setActiveSection('Übersicht')}>Startseite</button><button className={activeSection === 'Forum' ? 'nav-active' : ''} onClick={() => setActiveSection('Forum')}>Forum</button><button onClick={() => setActiveSection('News')}>News</button></nav>
        <div className="account"><a className="play-button" href={launcherDownloadUrl} download>Launcher herunterladen</a>{session ? <><span className="online-dot" />{session.user.name || session.user.email}<button className="ghost-button" onClick={() => signOut()}>Abmelden</button></> : <><Link className="login-button" href="/api/auth/signin">Anmelden</Link><Link className="register-link" href="/register">Registrieren</Link></>}</div>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">LIBERTY STATE • LOS SANTOS</p><h1>Deine Geschichte.<br /><em>Deine Stadt.</em><br />Dein Roleplay.</h1><p className="hero-text">Eine lebendige Welt, echte Entscheidungen und eine Community, die deine Geschichte schreibt.</p><div className="hero-actions"><a className="primary-button" href={launcherDownloadUrl} download>Launcher herunterladen <span>↓</span></a><button className="secondary-button" onClick={() => setActiveSection('Forum')}>Forum entdecken</button></div></div>
        <div className="hero-art"><div className="sunset" /><div className="skyline">LIBERTY<br /><span>STATE</span></div></div>
      </section>

      <section className="content-area">
        <div className="section-heading"><div><p className="eyebrow">COMMUNITY HUB</p><h2>{activeSection === 'Forum' ? 'Das Forum' : 'Was beschäftigt dich?'}</h2></div><button className="primary-button compact" onClick={() => session ? setShowForm(true) : window.location.href = '/api/auth/signin'}>+ Neuer Thread</button></div>
        <div className="forum-grid">{sections.map(section => <button className={`forum-card ${section.accent}`} key={section.title} onClick={() => setActiveSection('Forum')}><span className="card-icon">{section.icon}</span><span className="card-copy"><strong>{section.title}</strong><small>{section.description}</small></span><span className="card-count">{threads.filter(thread => thread.category === section.title).length}<small>Threads</small></span></button>)}</div>
        <div className="lower-grid"><div className="thread-panel"><div className="panel-title"><h3>Aktuelle Diskussionen</h3><button onClick={() => setActiveSection('Forum')}>Alle anzeigen →</button></div>{threads.map(thread => <button className="thread-row" key={thread.id} onClick={async () => { const response = await fetch(`/api/threads/${thread.id}`); if (response.ok) setOpenThread(await response.json()) }}><span className="thread-avatar">{thread.title[0]}</span><span><strong>{thread.title}</strong><small>{thread.category} · {new Date(thread.updatedAt).toLocaleDateString('de-DE')}</small></span><span className={`status ${thread.status === 'In Bearbeitung' ? 'working' : ''}`}>{thread.status}</span></button>)}</div><aside className="profile-panel"><p className="eyebrow">DEIN PROFIL</p><h3>{session?.user?.name || 'Gastspieler'}</h3><div className={`role-pill ${roleClass(currentRole)}`}>{currentRole}</div><p className="permission-note">Melde dich an, um Threads zu öffnen und Beiträge zu schreiben.</p></aside></div>
      </section>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><form className="thread-form" onSubmit={async event => { event.preventDefault(); const form = new FormData(event.currentTarget); const response = await fetch('/api/threads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.get('title'), content: form.get('content'), category: form.get('section') }) }); if (response.ok) { const thread = await response.json(); setThreads(current => [thread, ...current]); setShowForm(false) } else { alert('Bitte zuerst anmelden, um einen Thread zu erstellen.') } }} onClick={event => event.stopPropagation()}><button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button><p className="eyebrow">NEUES THEMA</p><h2>Bewerbung oder Thread erstellen</h2><label>Bereich<select name="section" defaultValue="Fraktionsbewerbungen"><option>Fraktionsbewerbungen</option><option>Team Bewerbungen</option><option>Allgemein</option><option>Support</option></select></label><label>Titel<input name="title" required placeholder="Worum geht es?" /></label><label>Dein Beitrag<textarea name="content" required rows="5" placeholder="Schreibe deine Bewerbung oder Nachricht ..." /></label><button className="primary-button" type="submit">Thread veröffentlichen <span>→</span></button></form></div>}
      {openThread && <div className="modal-backdrop" onClick={() => setOpenThread(null)}><section className="thread-form thread-detail" onClick={event => event.stopPropagation()}><button className="close-button" onClick={() => setOpenThread(null)}>×</button><p className="eyebrow">{openThread.category} · {openThread.status}</p><h2>{openThread.title}</h2>{openThread.posts.map(post => <article className="post" key={post.id}><div><strong>{post.author.name || post.author.email}</strong><span className={`role-pill ${roleClass(post.author.role)}`}>{post.author.role}</span></div><p>{post.content}</p></article>)}{session && <form onSubmit={async event => { event.preventDefault(); const response = await fetch(`/api/threads/${openThread.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: reply }) }); if (response.ok) { const post = await response.json(); setOpenThread(current => ({ ...current, posts: [...current.posts, post] })); setReply('') } }}><textarea value={reply} onChange={event => setReply(event.target.value)} required rows="3" placeholder="Antwort schreiben ..." /><button className="primary-button" type="submit">Antwort veröffentlichen</button></form>}</section></div>}
    </main>
  )
}
