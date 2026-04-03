import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function Login() {
  const { login } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(form.email, form.password); showFlash('Вы вошли в систему'); navigate('/') }
    catch (err) { setError(err.data?.error || 'Неверный email или пароль') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-heading">Вход в Portals</h1>
          <p className="text-sm text-faint mt-1">Войдите в свой аккаунт</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {error && <p className="text-sm text-red-500 mt-0 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="login-password">Пароль</label>
              <input
                id="login-password"
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={inputClass}
                placeholder="••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-faint mt-6">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
