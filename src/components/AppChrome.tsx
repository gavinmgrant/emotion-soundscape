"use client"

import { cn } from "@/lib/utils"

type AppChromeProps = {
  immersed: boolean
}

const GITHUB_URL = "https://github.com/gavinmgrant/emotion-soundscape"

const AppChrome = ({ immersed }: AppChromeProps) => {
  return (
    <header
      className={cn(
        "group/chrome absolute top-0 right-0 left-0 z-10 flex items-start justify-between px-4 pt-4 pb-10 transition-opacity duration-500",
        immersed
          ? "opacity-0 hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-35"
          : "opacity-100",
      )}
    >
      <h1 className="text-sm font-medium tracking-wide text-white/55 transition-colors group-hover/chrome:text-white/80">
        Emotion Soundscape
      </h1>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        title="View source on GitHub"
        className="rounded-xl p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:bg-white/10 focus-visible:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      </a>
    </header>
  )
}

export default AppChrome
