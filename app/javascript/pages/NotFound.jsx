import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <p className="text-7xl font-semibold text-softer mb-4">404</p>
        <p className="text-muted mb-8">Страница не найдена</p>
        <Link to="/" className="px-5 py-2 rounded-full glass-card text-sm text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors">
          На главную
        </Link>
      </div>
    </div>
  )
}
