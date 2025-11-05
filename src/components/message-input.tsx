"use client"

import { useRef, useCallback } from "react"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const input = inputRef.current
    if (!input || !input.value.trim() || disabled) return
    
    const message = input.value.trim()
    onSend(message)
    input.value = ''
    
    // Refocus for next message
    setTimeout(() => input.focus(), 50)
  }, [onSend, disabled])

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        ref={inputRef}
        type="text"
        
        placeholder="Type a message..."
        disabled={disabled}
        autoComplete="off"
        style={{ fontSize: '16px' }}
        className="flex-1 px-3 py-2 outline-none bg-background border-3 border-input rounded-md text-foreground disabled:opacity-50"
      />
      
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 bg-gray-500 text-primary-foreground rounded-md hover:bg-green-500 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  )
}