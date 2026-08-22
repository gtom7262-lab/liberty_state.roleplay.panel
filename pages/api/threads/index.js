import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

const factionRoles = ['Projektinhaber', 'Stellv. Projektinhaber', 'Fraktionsverwaltungsleitung', 'Fraktionsverwaltung', 'Test Fraktionsverwaltung']
const teamRoles = ['Projektinhaber', 'Stellv. Projektinhaber', 'Teamleitung', 'Stellv. Teamleitung']

function canModerate(category, role) {
  return category === 'Fraktionsbewerbungen' ? factionRoles.includes(role) : category === 'Team Bewerbungen' ? teamRoles.includes(role) : false
}

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (req.method === 'GET') {
    const threads = await prisma.thread.findMany({ orderBy: { updatedAt: 'desc' }, take: 50, include: { author: { select: { name: true, role: true } }, _count: { select: { posts: true } } } })
    return res.status(200).json(threads)
  }
  if (!session) return res.status(401).json({ error: 'Anmeldung erforderlich' })
  if (req.method === 'POST') {
    const { title, content, category } = req.body
    if (!title || !content || !category) return res.status(400).json({ error: 'Titel, Beitrag und Bereich sind erforderlich' })
    const thread = await prisma.thread.create({ data: { title: title.trim(), category, authorId: session.user.id, posts: { create: { content: content.trim(), authorId: session.user.id } } }, include: { author: { select: { name: true, role: true } }, _count: { select: { posts: true } } } })
    return res.status(201).json(thread)
  }
  if (req.method === 'PATCH') {
    const { id, status } = req.body
    const thread = await prisma.thread.findUnique({ where: { id } })
    if (!thread || !['Offen', 'In Bearbeitung', 'Angenommen', 'Abgelehnt', 'Geschlossen'].includes(status)) return res.status(400).json({ error: 'Ungültige Anfrage' })
    if (!canModerate(thread.category, session.user.role)) return res.status(403).json({ error: 'Keine Berechtigung' })
    const updated = await prisma.thread.update({ where: { id }, data: { status }, include: { author: { select: { name: true, role: true } }, _count: { select: { posts: true } } } })
    return res.status(200).json(updated)
  }
  return res.status(405).json({ error: 'Methode nicht erlaubt' })
}
