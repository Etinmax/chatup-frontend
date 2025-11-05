import { useEffect, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { format, isToday, isYesterday } from "date-fns"

interface Message {
  id: string
  text: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
  sender?: {
    id: string
    name: string
    image: string | null
  }
}

interface User {
  id: string
  name: string
  avatar: string | null
}

interface ChatWindowProps {
  messages: Message[]
  currentUser: User
  currentUserId?: string
}

export default function ChatWindow({
  messages,
  currentUser,
  currentUserId,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Format message timestamps
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)

    if (isToday(date)) return format(date, "h:mm a")
    if (isYesterday(date)) return `Yesterday ${format(date, "h:mm a")}`
    return format(date, "MMM d, h:mm a")
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []

    messages.forEach((message) => {
      const date = new Date(message.createdAt)
      let dateLabel = format(date, "MMMM d, yyyy")

      if (isToday(date)) dateLabel = "Today"
      else if (isYesterday(date)) dateLabel = "Yesterday"

      const existingGroup = groups.find((g) => g.date === dateLabel)
      if (existingGroup) {
        existingGroup.messages.push(message)
      } else {
        groups.push({ date: dateLabel, messages: [message] })
      }
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  // Empty state when there are no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
              />
              <AvatarFallback>
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
            Start a conversation with {currentUser.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Send a message to begin chatting
          </p>
        </div>
      </div>
    )
  }

  // Chat window with scrollable history
  return (
    <div className="flex-1 h-full overflow-hidden">
      <div className="h-full overflow-y-auto p-3 md:p-4 space-y-4 scroll-smooth">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground font-medium">
                  {group.date}
                </span>
              </div>
            </div>

            {/* Messages */}
            {group.messages.map((message) => {
              const isSent = message.senderId === currentUserId

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 md:gap-3 mb-3 md:mb-4",
                    isSent ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Sender Avatar (for received messages) */}
                  {!isSent && (
                    <Avatar className="h-7 w-7 md:h-8 md:w-8 shrink-0">
                      <AvatarImage
                        src={
                          message.sender?.image ||
                          currentUser.avatar ||
                          "/placeholder.svg"
                        }
                        alt={message.sender?.name || currentUser.name}
                      />
                      <AvatarFallback className="text-xs">
                        {(message.sender?.name || currentUser.name)
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%]",
                      isSent ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 md:px-4 md:py-2",
                        isSent
                          ? "bg-green-500 text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      )}
                    >
                      <p className="text-sm md:text-base break-words whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {isSent && (
                        <span className="text-xs text-muted-foreground">
                          {message.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}