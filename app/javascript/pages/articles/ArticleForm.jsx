import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

export default function ArticleForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({ title: '', body: '', game_id: '', published_at: '' })
  const [games, setGames] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => { if (user && user.role !== 'admin') navigate('/articles') }, [user])

  useEffect(() => {
    api.get('/api/games?per_page=1000').then(data => setGames(data.games || []))
    if (isEdit) {
      api.get(`/api/articles/${id}`).then(data => {
        const a = data.article
        setForm({ title: a.title, body: a.body, game_id: a.game_id || '', published_at: a.published_at?.slice(0, 16) || '' })
      }).finally(() => setLoading(false))
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors([])
    const payload = { ...form }
    if (!payload.game_id) delete payload.game_id
    if (!payload.published_at) payload.published_at = new Date().toISOString()
    try {
      if (isEdit) { await api.patch(`/api/articles/${id}`, { article: payload }); showFlash('Статья обновлена'); navigate(`/articles/${id}`) }
      else { const data = await api.post('/api/articles', { article: payload }); showFlash('Статья создана'); navigate(`/articles/${data.article.id}`) }
    } catch (err) { setErrors(err.data?.errors || [err.message]) }
  }

  const inputClass =
    'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div className="h-10 max-w-sm rounded-2xl skeleton-shimmer" />
          <div className="h-96 rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-heading mb-8">{isEdit ? 'Редактировать статью' : 'Новая статья'}</h1>
        {errors.length > 0 && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 mb-6">
            {errors.map((e, i) => (
              <p key={i} className="text-sm text-red-400">
                {e}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="article-title" className="block text-sm text-muted mb-1.5">
              Заголовок
            </label>
            <input
              id="article-title"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="article-body" className="block text-sm text-muted mb-1.5">
              Текст
            </label>
            <textarea
              id="article-body"
              rows={12}
              value={form.body}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              className={`${inputClass} resize-none`}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="article-game" className="block text-sm text-muted mb-1.5">
                Связанная игра
              </label>
              <select
                id="article-game"
                value={form.game_id}
                onChange={e => setForm(p => ({ ...p, game_id: e.target.value }))}
                className={inputClass}
              >
                <option value="">Без привязки</option>
                {games.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="article-published-at" className="block text-sm text-muted mb-1.5">
                Дата публикации
              </label>
              <input
                id="article-published-at"
                type="datetime-local"
                value={form.published_at}
                onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
              {isEdit ? 'Сохранить' : 'Опубликовать'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors text-sm font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
