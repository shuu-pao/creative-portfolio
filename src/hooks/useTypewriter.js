import { useEffect, useRef, useState } from 'react'

// Typewriter effect for a piece of text. Returns the currently displayed slice
// and whether it is still typing. Explicitly guards against an out-of-bounds /
// undefined character so we can never append the literal string "undefined".
export function useTypewriter(text, typingSpeed = 30) {
  const [displayed, setDisplayed] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typewriterRef = useRef(null)

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      setIsTyping(false)
      return undefined
    }

    const textToDisplay = text
    setDisplayed('')
    setIsTyping(true)

    let charIndex = 0
    if (typewriterRef.current) clearTimeout(typewriterRef.current)

    function typeNextChar() {
      const ch = textToDisplay[charIndex]
      if (ch === undefined) {
        setIsTyping(false)
        return
      }
      setDisplayed((prev) => prev + ch)
      charIndex += 1
      if (charIndex < textToDisplay.length) {
        typewriterRef.current = setTimeout(typeNextChar, typingSpeed)
      } else {
        setIsTyping(false)
      }
    }

    typewriterRef.current = setTimeout(typeNextChar, typingSpeed)

    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current)
    }
  }, [text, typingSpeed])

  return { displayed, isTyping }
}
