"use client"

import { useState } from "react"

export default function EmotionInput({
  onSetEmotion,
}: {
  onSetEmotion: (e: string) => void
}) {
  const [input, setInput] = useState("")

  return (
    <div className="absolute top-0 flex flex-col items-center gap-2">
      <input
        type="text"
        placeholder="Describe an emotion..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 rounded border border-gray-600 bg-gray-800 text-white w-80"
      />
      <button
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        onClick={() => onSetEmotion(input)}
      >
        Generate
      </button>
    </div>
  )
}
