import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

const roles = ['Projektinhaber', 'Stellv. Projektinhaber', 'Projektmanagement', 'Projektverwaltung', 'Stellv. Projektverwaltung', 'Manager', 'Head Developer', 'Senior Developer', 'Developer', 'Junior Developer', 'Community Manager', 'Teamleitung', 'Stellv. Teamleitung', 'Head Administrator', 'Senior Administrator', 'Server Administrator', 'Junior Administrator', 'Senior Moderator', 'Moderator', 'Junior Moderator', 'Senior Supporter', 'Supporter', 'Junior Supporter', 'Fraktionsverwaltungsleitung', 'Fraktionsverwaltung', 'Test Fraktionsverwaltung', 'Analystenleitung', 'Stellv. Analystenleitung', 'Head Analyst', 'Analyst', 'Probe Analyst', 'Leiter der Fraktion', 'Stellv. Leiter der Fraktion', 'Spieler']

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session || session.user.role !== 'Projektinhaber') return res.status(403).json({ error: 'Nur der Projektinhaber darf Ränge verwalten' })
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'asc' } })
    return res.status(200).json(users)
  }
  if (req.method === 'PATCH') {
    const { userId, role } = req.body
    if (!userId || !roles.includes(role)) return res.status(400).json({ error: 'Benutzer und gültiger Rang sind erforderlich' })
    const user = await prisma.user.update({ where: { id: userId }, data: { role }, select: { id: true, name: true, email: true, role: true } })
    return res.status(200).json(user)
  }
  return res.status(405).json({ error: 'Methode nicht erlaubt' })
}
