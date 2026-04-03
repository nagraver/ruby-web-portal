import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-brand-600">Portals</span>
          <div className="flex items-center gap-4 text-xs text-faint">
            <Link to="/games" className="hover:text-heading transition-colors">Игры</Link>
            <Link to="/articles" className="hover:text-heading transition-colors">Новости</Link>
          </div>
        </div>
        <p className="text-xs text-softer">&copy; {new Date().getFullYear()} Portals</p>
      </div>
    </footer>
  )
}
