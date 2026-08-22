import bcrypt from 'bcrypt'
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'User already exists' })

  const hashed = await bcrypt.hash(password, 10)
  const role = email.toLowerCase() === process.env.OWNER_EMAIL?.toLowerCase() ? 'Projektinhaber' : 'Spieler'
  const user = await prisma.user.create({ data: { name, email, password: hashed, role } })
  return res.status(201).json({ id: user.id, email: user.email })
}
