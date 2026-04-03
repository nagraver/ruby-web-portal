import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function Register() {
  const { register } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors([]); setLoading(true)
    try { await register(form); showFlash('Добро пожаловать!'); navigate('/') }
    catch (err) { setErrors(err.data?.errors || [err.message]) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-heading">Регистрация</h1>
          <p className="text-sm text-faint mt-1">Создайте аккаунт в Portals</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {errors.length > 0 && (
            <div className="space-y-1 mb-3">
              {errors.map((e, i) => (
                <p key={i} className="text-sm text-red-500">{e}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="register-username">Имя пользователя</label>
              <input
                id="register-username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className={inputClass}
                placeholder="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="register-password">Пароль</label>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={inputClass}
                placeholder="Минимум 6 символов"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="register-password-confirmation">Подтверждение пароля</label>
              <input
                id="register-password-confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))}
                className={inputClass}
                placeholder="Повторите пароль"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-faint mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
