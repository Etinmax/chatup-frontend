"use client"

import { useSession } from "next-auth/react"
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  // Optional: show a loader while session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading...</p>
      </div>
    )
  }

  // If not logged in, show only children (which will show your “Sign In” screen)
  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  // Authenticated view with sidebar
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}


{/*"use client"

import Sidebar from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Navigation Sidebar - Always on left *
      <Sidebar />
      
      {/* Main Content Area *
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}*/}

{/*"use client"

import Sidebar from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] bg-background relative overflow-hidden">
      {/* Desktop sidebar only *
      <Sidebar />
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  )
}*/}

{/*"use client"

import Sidebar from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <Sidebar />
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  )
}*/}
