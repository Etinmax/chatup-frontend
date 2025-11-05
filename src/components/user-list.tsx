import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  bio?: string
  isOnline: boolean
  lastSeen: Date
  lastMessage?: {
    text: string
    timestamp: Date
    isRead: boolean
    isSent: boolean
  } | null
}

interface UserListProps {
  users: User[]
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  currentUserId?: string
}

export default function UserList({ users, selectedUserId, onSelectUser, currentUserId }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">No users found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {users.map((user) => {
        const isSelected = selectedUserId === user.id
        const hasUnreadMessage = user.lastMessage && !user.lastMessage.isRead && !user.lastMessage.isSent

        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={cn(
              "w-full p-3 md:p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors border-b border-border",
              isSelected && "bg-accent"
            )}
          >
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 md:h-12 md:w-12">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className={cn(
                  "font-medium text-sm md:text-base truncate",
                  hasUnreadMessage ? "text-foreground font-semibold" : "text-foreground"
                )}>
                  {user.name}
                </h3>
                {user.lastMessage && (
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {formatDistanceToNow(new Date(user.lastMessage.timestamp), { addSuffix: true })}
                  </span>
                )}
              </div>

              {user.lastMessage ? (
                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    "text-xs md:text-sm truncate",
                    hasUnreadMessage ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {user.lastMessage.isSent && "You: "}
                    {user.lastMessage.text}
                  </p>
                  {hasUnreadMessage && (
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                  )}
                </div>
              ) : (
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {user.bio || "No messages yet"}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}