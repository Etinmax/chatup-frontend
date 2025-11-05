"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MessageSquare, Settings, LogOut, User, X, Menu} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"

export default function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navItems = [
    { icon: MessageSquare, href: "/dashboard", key: "chat", label: "Messages" },
    { icon: User, href: "/profile", key: "profile", label: "Profile" },
    { icon: Settings, href: "/settings", key: "settings", label: "Settings" },
  ]

  const handleNav = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  const getUserInitials = () => {
    if (session?.user?.name) return session.user.name.charAt(0).toUpperCase()
    if (session?.user?.email) return session.user.email.charAt(0).toUpperCase()
    return "U"
  }

  return (
    <div className="relative">
      {/* Mobile Toggle Button - Sidebar Icon on Top Right */}
      <Button
        size="icon"
        variant="ghost"
        className="md:hidden fixed top-3 right-3 z-50 bg-card/80 backdrop-blur-sm border border-border hover:bg-card"
        onClick={() => setOpen(!open)}
      >
        {/*<MessageSquare className="w-5 h-5" />*/}
         <Menu className="w-5 h-5" />


      </Button>

      {/* Overlay for Mobile */}
      {open && (
        <div
          className="md:hidden absolute inset-0 bg-black/50 z-20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          absolute md:static top-0 left-0 h-full z-30
          w-64 md:w-20
          bg-[#0f172a] text-white
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-xl md:shadow-none
        `}
      >
        {/* Top Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 mt-2 md:justify-center md:py-2">
            <a href="/" className="flex items-center gap-3">
              <img className="w-20 h-7 md:w-15 md:h-6" src="/cu.png" alt="Logo" />
            </a>
            {/* Close Button for Mobile */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="h-px bg-gray-800 mx-4 md:mx-2" />

          {/* User Profile (Mobile Only) */}
          <div className="md:hidden p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-green-400">
                <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                <AvatarFallback className="bg-green-400/20 text-green-400 text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6">
            <div className="flex flex-col gap-2 px-3">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Button
                    key={item.key}
                    variant="ghost"
                    onClick={() => handleNav(item.href)}
                    className={`
                      w-full justify-start md:justify-center
                      h-12 md:h-11
                      rounded-xl
                      transition-all duration-200
                      ${isActive 
                        ? "bg-green-400/20 text-green-400 hover:bg-green-400/30" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                    `}
                  >
                    <item.icon className="w-5 h-5 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="md:hidden ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  </Button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 p-4 md:p-3">
          <div className="flex md:flex-col items-center gap-3">
            {/* Avatar (Desktop) */}
            <div className="hidden md:flex flex-col items-center gap-3 mb-2">
              {status === "loading" ? (
                <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
              ) : (
                <Avatar className="w-10 h-10 cursor-pointer border-2 border-green-400">
                  <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="bg-green-400/20 text-green-400">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })}
              disabled={status === "loading"}
              className="
                w-full md:w-auto
                justify-start md:justify-center
                h-11
                text-red-400 hover:text-red-300
                hover:bg-red-500/10
                rounded-xl
                transition-all duration-200
              "
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="md:hidden ml-3 text-sm font-medium">
                Sign Out
              </span>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

{/*"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MessageSquare, Settings, LogOut, User, X, Menu } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"

export default function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navItems = [
    { icon: MessageSquare, href: "/dashboard", key: "chat", label: "Messages" },
    { icon: User, href: "/profile", key: "profile", label: "Profile" },
    { icon: Settings, href: "/settings", key: "settings", label: "Settings" },
  ]

  const handleNav = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  const getUserInitials = () => {
    if (session?.user?.name) return session.user.name.charAt(0).toUpperCase()
    if (session?.user?.email) return session.user.email.charAt(0).toUpperCase()
    return "U"
  }

  return (
    <>
      {/* Sidebar container 
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 w-64 md:w-20
          bg-[#0f172a] text-white flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-xl md:shadow-none`}
      >
        {/* Header *
        <div className="flex items-center justify-between p-4 md:justify-center md:py-3">
          <a href="/" className="flex items-center gap-3">
            <img className="w-8 h-8 md:w-10 md:h-10" src="/cu.png" alt="Logo" />
            <span className="md:hidden text-lg font-semibold">ChatUp</span>
          </a>
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Nav Items *
        <nav className="flex-1 py-6">
          <div className="flex flex-col gap-2 px-3">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  onClick={() => handleNav(item.href)}
                  className={`w-full justify-start md:justify-center h-12 md:h-11 rounded-xl
                    ${isActive
                      ? "bg-green-400/20 text-green-400 hover:bg-green-400/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="md:hidden ml-3 text-sm font-medium">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Logout *
        <div className="border-t border-gray-800 p-4 md:p-3">
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
            disabled={status === "loading"}
            className="w-full justify-start md:justify-center h-11 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="md:hidden ml-3 text-sm font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile menu button *
      <div className="md:hidden fixed top-3 right-3 z-50">
        <Button
          size="icon"
          variant="ghost"
          className="bg-card/80 backdrop-blur-sm border border-border hover:bg-card"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Overlay *
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}*/}
