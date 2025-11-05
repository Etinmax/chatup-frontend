"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"

export default function InputDebug({ onSend }: { onSend: (msg: string) => void }) {
  const [value, setValue] = useState("")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (msg: string) => {
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  useEffect(() => {
    addDebug("Component mounted")
  }, [])

  const handleFocus = () => {
    addDebug("Input focused")
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    addDebug("Touch start detected")
  }

  const handleClick = (e: React.MouseEvent) => {
    addDebug("Click detected")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    addDebug(`Value changed: ${e.target.value}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      addDebug("Message sent")
      onSend(value.trim())
      setValue("")
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Debug Info */}
      <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded text-xs space-y-1">
        <p className="font-bold">Debug Info:</p>
        {debugInfo.map((info, i) => (
          <p key={i}>{info}</p>
        ))}
        {debugInfo.length === 0 && <p>No events yet</p>}
      </div>

      {/* Test Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => addDebug("Test button clicked")}
          className="w-full p-3 bg-blue-500 text-white rounded"
        >
          Test Button (Click Me)
        </button>
        
        <div
          onTouchStart={() => addDebug("Div touched")}
          className="w-full p-3 bg-green-500 text-white rounded text-center"
        >
          Test Touch Area (Touch Me)
        </div>
      </div>

      {/* Actual Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="text-sm font-bold">Message Input:</div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          placeholder="Type here to test..."
          className="w-full p-3 border-2 border-black dark:border-white rounded text-base"
          style={{
            WebkitAppearance: 'none',
            fontSize: '16px',
            touchAction: 'manipulation'
          }}
        />
        
        <button
          type="submit"
          className="w-full p-3 bg-primary text-primary-foreground rounded flex items-center justify-center gap-2"
          onClick={() => addDebug("Send button clicked")}
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>

      {/* Current Value Display */}
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
        <p className="font-bold">Current Input Value:</p>
        <p>{value || "(empty)"}</p>
      </div>
    </div>
  )
}