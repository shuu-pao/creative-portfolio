import { useState, useEffect, useRef, useCallback } from 'react'
import { BOT_OPENING, USER_OPTIONS, BOT_WRAPUP, RESTART_LABEL, BOT_NAME, USER_NAME } from '../data/chatData'
import './ChatAppAboutMe.css'

// Typing-indicator delay range (ms) — brief, so the chat feels snappy.
const TYPING_MIN = 150
const TYPING_MAX = 500

// Persona 5-inspired chat "menu screen" that replaces the plain ABOUT ME copy.
// The bot opens with a greeting + 4 revisitable options; picking one renders the
// player's message, a short typing indicator, then the bot's predetermined reply.
// CTA replies navigate to other portfolio sections via `onNavigate`, playing a
// fast diagonal slash-wipe first. `onBack`/`onHover`/`onSelect` reuse the app's
// existing menu callbacks (esc/back + button sounds).
export default function ChatAppAboutMe({ onBack, onHover, onSelect, onNavigate }) {
  const messagesEndRef = useRef(null)
  const timersRef = useRef([])

  // Conversation transcript. Seeded (in an effect) with the bot's opening line.
  const [messages, setMessages] = useState([])
  // Per-option "visited" flags drive the P5 stamp + the wrap-up gate.
  const [visited, setVisited] = useState({})
  // Hidden while the bot "types" so the player can't stack requests.
  const [showOptions, setShowOptions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const allVisited = USER_OPTIONS.every((opt) => visited[opt.id])

  // Track every timeout so we can clear them on unmount / restart and avoid
  // setState-after-unmount warnings.
  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // Seed the opening message on mount; clear pending timers on unmount.
  useEffect(() => {
    const id = setTimeout(() => {
      setMessages([{ key: 'opening', sender: 'bot', text: BOT_OPENING }])
      setShowOptions(true)
    }, 250)
    timersRef.current.push(id)
    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  // Auto-scroll to the newest message / control.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping, showOptions, allVisited])

  function handleOptionClick(option) {
    if (isTyping || transitioning) return
    onSelect?.()

    // Render the player's chosen line, mark the option visited, hide the menu.
    setMessages((prev) => [
      ...prev,
      { key: `user-${option.id}-${prev.length}`, sender: 'user', text: option.label },
    ])
    setVisited((prev) => ({ ...prev, [option.id]: true }))
    setShowOptions(false)
    setIsTyping(true)

    // Brief typing indicator (150–500ms), then the bot's predetermined reply.
    const delay = TYPING_MIN + Math.random() * (TYPING_MAX - TYPING_MIN)
    schedule(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          key: `bot-${option.id}-${prev.length}`,
          sender: 'bot',
          text: option.botResponse.text,
          cta: option.botResponse.cta,
        },
      ])
      // Reveal the option menu again on the next tick so it slams in after the
      // bubble. If this was the final unseen option, the wrap-up shows instead.
      schedule(() => setShowOptions(true), 250)
    }, delay)
  }

  function handleCTA(target) {
    if (transitioning) return
    onSelect?.()
    // Fast diagonal slash-wipe, then hand off navigation to the app.
    setTransitioning(true)
    schedule(() => {
      onNavigate?.(target)
    }, 380)
  }

  function handleRestart() {
    onSelect?.()
    clearTimers()
    setMessages([{ key: 'opening', sender: 'bot', text: BOT_OPENING }])
    setVisited({})
    setIsTyping(false)
    setTransitioning(false)
    setShowOptions(true)
  }

  function handleBack() {
    onBack?.()
  }

  return (
    <div className="chat-app">
      {/* Header — messaging-app style contact bar */}
      <div className="chat-app-header">
        <div className="chat-app-id">
          <span className="chat-app-avatar" aria-hidden="true">AI</span>
          <div className="chat-app-name-wrap">
            <span className="chat-app-name">{BOT_NAME}</span>
            <span className="chat-app-status">
              <span className="chat-app-status-dot" aria-hidden="true" />
              ONLINE
            </span>
          </div>
        </div>
        <button type="button" className="chat-app-back" onClick={handleBack} onMouseEnter={onHover}>
          CLOSE
        </button>
      </div>

      {/* Message log */}
      <div className="chat-app-log" role="log" aria-live="polite">
        {messages.map((msg) => (
          <ChatMessage key={msg.key} message={msg} onCTA={handleCTA} onHover={onHover} />
        ))}

        {isTyping && (
          <div className="chat-row chat-row-bot">
            <span className="chat-app-avatar chat-bubble-avatar" aria-hidden="true">AI</span>
            <div className="chat-bubble chat-bubble-bot chat-typing" aria-label="Typing">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          </div>
        )}

        {/* Wrap-up bot bubble, shown once every option has been visited. */}
        {allVisited && showOptions && !isTyping && (
          <div className="chat-row chat-row-bot">
            <span className="chat-app-avatar chat-bubble-avatar" aria-hidden="true">AI</span>
            <div className="chat-bubble chat-bubble-bot chat-bubble-wrapup">
              <p className="chat-bubble-text">{BOT_WRAPUP}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Option deck / restart control */}
      <div className="chat-app-deck">
        {showOptions && !allVisited && (
          <div className="chat-options" role="group" aria-label="Reply options">
            {USER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`chat-option ${visited[option.id] ? 'visited' : ''}`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={onHover}
                disabled={isTyping || transitioning}
              >
                <span className="chat-option-label">{option.label}</span>
                {visited[option.id] && <span className="chat-option-stamp" aria-hidden="true">SEEN</span>}
              </button>
            ))}
          </div>
        )}

        {showOptions && allVisited && (
          <button
            type="button"
            className="chat-restart"
            onClick={handleRestart}
            onMouseEnter={onHover}
            disabled={transitioning}
          >
            ↻ {RESTART_LABEL}
          </button>
        )}
      </div>

      {/* Diagonal slash-wipe overlay for CTA navigation. */}
      {transitioning && (
        <div className="chat-wipe" aria-hidden="true">
          <span className="chat-wipe-panel chat-wipe-panel-a" />
          <span className="chat-wipe-panel chat-wipe-panel-b" />
        </div>
      )}
    </div>
  )
}

// A single chat row: bot bubbles sit left with an avatar, user bubbles right.
// Bot bubbles may carry a CTA button that triggers a section jump.
function ChatMessage({ message, onCTA, onHover }) {
  const isUser = message.sender === 'user'
  return (
    <div className={`chat-row ${isUser ? 'chat-row-user' : 'chat-row-bot'}`}>
      {!isUser && <span className="chat-app-avatar chat-bubble-avatar" aria-hidden="true">AI</span>}
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
        <p className="chat-bubble-text">{message.text}</p>
        {message.cta && (
          <button
            type="button"
            className="chat-cta"
            onClick={() => onCTA(message.cta.target)}
            onMouseEnter={onHover}
          >
            <span className="chat-cta-slash" aria-hidden="true" />
            <span className="chat-cta-label">{message.cta.label}</span>
          </button>
        )}
      </div>
      {isUser && <span className="chat-app-avatar chat-bubble-avatar chat-bubble-avatar-user" aria-hidden="true">{USER_NAME}</span>}
    </div>
  )
}
