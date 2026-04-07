import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const deskLink = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? 'text-heading font-medium' : 'text-muted hover:text-heading'}`

const mobileLink = ({ isActive }) =>
  `block py-2 text-sm transition-colors ${isActive ? 'text-heading font-medium' : 'text-muted hover:text-heading'}`

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [location])

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-base font-semibold text-brand-600">Portals</Link>
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/games" className={deskLink}>Игры</NavLink>
              <NavLink to="/articles" className={deskLink}>Новости</NavLink>
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/genres" className={deskLink}>Жанры</NavLink>
                  <NavLink to="/admin/dashboard" className={deskLink}>Панель</NavLink>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggle} className="p-2 text-faint hover:text-heading transition-colors" title={isDark ? 'Светлая тема' : 'Тёмная тема'}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <>
                <Link to={`/profile/${user.username}`} className="flex items-center gap-2 text-sm text-body hover:text-heading transition-colors">
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-semibold text-brand-700">
                    {user.username[0].toUpperCase()}
                  </div>
                  {user.username}
                </Link>
                <Link to="/edit-profile" className="text-faint hover:text-heading transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </Link>
                <button onClick={handleLogout} className="text-sm text-faint hover:text-heading transition-colors">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted hover:text-heading transition-colors">Войти</Link>
                <Link to="/register" className="px-4 py-1.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">Регистрация</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button onClick={toggle} className="p-2 text-faint hover:text-heading transition-colors">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setOpen(!open)} className="p-2 text-muted hover:text-heading">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--card-border)] px-4 py-3 space-y-0.5 animate-fade-in">
          <NavLink to="/games" className={mobileLink}>Игры</NavLink>
          <NavLink to="/articles" className={mobileLink}>Новости</NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/genres" className={mobileLink}>Жанры</NavLink>
              <NavLink to="/admin/dashboard" className={mobileLink}>Панель</NavLink>
            </>
          )}
          <div className="border-t border-[var(--card-border)] pt-3 mt-2 space-y-0.5">
            {user ? (
              <>
                <Link to={`/profile/${user.username}`} onClick={() => setOpen(false)} className="block py-2 text-sm text-body hover:text-heading">{user.username}</Link>
                <button onClick={() => { handleLogout(); setOpen(false) }} className="block py-2 text-sm text-faint hover:text-heading">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm text-body hover:text-heading">Войти</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block py-2 text-sm text-brand-600">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function SunIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
}
function MoonIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
}
