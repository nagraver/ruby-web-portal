import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirmation: '', current_password: '' })
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (!user) navigate('/login')
    else setForm(p => ({ ...p, username: user.username, email: user.email }))
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors([])
    const params = { username: form.username, email: form.email, current_password: form.current_password }
    if (form.password) { params.password = form.password; params.password_confirmation = form.password_confirmation }
    try { await updateProfile(params); showFlash('Профиль обновлён'); navigate(`/profile/${form.username}`) }
    catch (err) { setErrors(err.data?.errors || [err.message]) }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md mx-auto px-4 w-full">
        <h1 className="text-lg font-medium text-heading text-center mb-6">Настройки профиля</h1>
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
              <label className="block text-sm text-muted mb-1.5" htmlFor="edit-username">Имя пользователя</label>
              <input
                id="edit-username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="edit-password">
                Новый пароль <span className="text-faint">(необязательно)</span>
              </label>
              <input
                id="edit-password"
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="edit-password-confirmation">Подтверждение пароля</label>
              <input
                id="edit-password-confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="border-t border-[var(--card-border)] pt-4">
              <label className="block text-sm text-muted mb-1.5" htmlFor="edit-current-password">
                Текущий пароль <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-current-password"
                type="password"
                value={form.current_password}
                onChange={e => setForm(p => ({ ...p, current_password: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors disabled:opacity-50"
            >
              Сохранить
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
