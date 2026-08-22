import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const thread = await prisma.thread.findUnique({ where: { id: req.query.id }, include: { author: { select: { name: true, email: true, role: true } }, posts: { orderBy: { createdAt: 'asc' }, include: { author: { select: { name: true, email: true, role: true } } } } } })
  if (!thread) return res.status(404).json({ error: 'Thread nicht gefunden' })
  if (req.method === 'GET') return res.status(200).json(thread)
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Anmeldung erforderlich' })
  if (req.method === 'POST') {
    if (!req.body.content?.trim()) return res.status(400).json({ error: 'Beitrag ist erforderlich' })
    const post = await prisma.post.create({ data: { content: req.body.content.trim(), authorId: session.user.id, threadId: thread.id }, include: { author: { select: { name: true, email: true, role: true } } } })
    return res.status(201).json(post)
  }
  return res.status(405).json({ error: 'Methode nicht erlaubt' })
}
