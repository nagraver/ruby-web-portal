import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'

const FlashContext = createContext(null)

export function FlashProvider({ children }) {
  const [flash, setFlash] = useState(null)
  const showFlash = useCallback((message, type = 'success') => setFlash({ message, type }), [])

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(null), 4000)
    return () => clearTimeout(timer)
  }, [flash])

  return <FlashContext.Provider value={{ flash, showFlash, setFlash }}>{children}</FlashContext.Provider>
}

export function useFlash() {
  const context = useContext(FlashContext)
  if (!context) throw new Error('useFlash must be used within FlashProvider')
  return context
}

export default function FlashMessage() {
  const { flash, setFlash } = useFlash()
  if (!flash) return null

  const palette = {
    success: 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5',
    error: 'text-red-600 border-red-500/20 bg-red-500/5',
    info: 'text-blue-600 border-blue-500/20 bg-blue-500/5',
  }

  return (
    <div className="fixed top-18 right-4 z-50 animate-slide-up">
      <div className={`${palette[flash.type] || palette.info} border rounded-xl px-4 py-3 flex items-center gap-3 backdrop-blur-md min-w-[240px]`}>
        <span className="text-sm flex-1">{flash.message}</span>
        <button onClick={() => setFlash(null)} className="opacity-40 hover:opacity-100 transition-opacity">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  )
}
