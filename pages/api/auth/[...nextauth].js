import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const ownerEmail = process.env.OWNER_EMAIL
        if (ownerEmail && user.email === ownerEmail) {
          const updatedUser = await prisma.user.update({ where: { email: user.email }, data: { role: 'Projektinhaber' } })
          user.role = updatedUser.role
        }
      } catch (e) {
        console.error('Error updating role on signIn:', e)
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.role = token.role || session.user.role
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})
