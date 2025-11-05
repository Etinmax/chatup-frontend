// app/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return user
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        // @ts-ignore
        session.user.id = token.sub!
        
        // Update user online status
        try {
          await prisma.user.update({
            where: { id: token.sub! },
            data: {
              isOnline: true,
              lastSeen: new Date(),
            },
          })
        } catch (error) {
          console.error("Error updating user status:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  events: {
    async signOut({ token, session }) {
      // Handle both JWT and database sessions
      const userId = token?.sub || session?.user?.id
      
      if (userId) {
        await prisma.user.update({
          where: { id: userId as string },
          data: {
            isOnline: false,
            lastSeen: new Date(),
          },
        })
      }
    },
  },
  pages: {
    signIn: "/signin",  // ✅ Fixed: matches your actual signin page
    error: "/signin",   // ✅ Show errors on signin page
  },
  session: {
    strategy: "jwt", // ✅ MUST use JWT for CredentialsProvider
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
{/*import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            console.log("User not found or no password")
            return null
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            console.log("Incorrect password")
            return null
          }

          console.log("Login successful for:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
     GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // Add more providers here
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-ignore — extend session user with id
        session.user.id = user.id

        await prisma.user.update({
          where: { id: user.id },
          data: {
            isOnline: true,
            lastSeen: new Date(),
          },
        })
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      // `token` is available here, not `session`
      if (token?.sub) {
        await prisma.user.update({
          where: { id: token.sub },
          data: {
            isOnline: false,
            lastSeen: new Date(),
          },
        })
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database", // ✅ works fine since you have PrismaAdapter
  },
}*/}
