"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Is it compatible with OBS?",
  "How do I receive my files?",
  "Do you have a free template?",
  "Can I preview with my camera?",
]

const GREETING =
  "Hi, I'm sempy Assist — the AI customer service assistant. Ask me about templates, compatibility, downloads, the free kit or your order."

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading, open])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      })
      const data = (await response.json()) as { reply?: string; error?: string }
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ??
            data.error ??
            "Sorry, I could not answer right now. Please try again or reply to your order email.",
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I am offline right now. You can still browse the shop, or reply to your order confirmation email for help.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[90] flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl chrome-surface bg-background/95 backdrop-blur-xl sm:right-6">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">sempy Assist</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI customer service
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "mr-auto max-w-[88%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
                }
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-left text-[11px] text-white/70 transition hover:border-white/35 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about templates, orders..."
              aria-label="Your message"
              className="h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-4 z-[90] flex items-center gap-2 rounded-full border border-white/25 bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition hover:bg-foreground/85 sm:right-6"
        aria-label={open ? "Close customer service chat" : "Open customer service chat"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? "Close" : "Need help?"}</span>
      </button>
    </>
  )
}
