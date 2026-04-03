import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function GameForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({ title: '', description: '', developer: '', publisher: '', release_date: '', cover_image: '', genre_ids: [] })
  const [genres, setGenres] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => { if (user && user.role !== 'admin') navigate('/games') }, [user])

  useEffect(() => {
    api.get('/api/genres').then(data => setGenres(data.genres))
    if (isEdit) {
      api.get(`/api/games/${id}`).then(data => {
        const g = data.game
        setForm({ title: g.title, description: g.description || '', developer: g.developer || '', publisher: g.publisher || '', release_date: g.release_date || '', cover_image: g.cover_image || '', genre_ids: g.genres?.map(x => x.id) || [] })
      }).finally(() => setLoading(false))
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors([])
    try {
      if (isEdit) { await api.patch(`/api/games/${id}`, { game: form }); showFlash('Игра обновлена'); navigate(`/games/${id}`) }
      else { const data = await api.post('/api/games', { game: form }); showFlash('Игра добавлена'); navigate(`/games/${data.game.id}`) }
    } catch (err) { setErrors(err.data?.errors || [err.message]) }
  }

  const toggleGenre = (gid) => setForm(p => ({ ...p, genre_ids: p.genre_ids.includes(gid) ? p.genre_ids.filter(x => x !== gid) : [...p.genre_ids, gid] }))

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        <div className="max-w-2xl mx-auto glass-card rounded-2xl skeleton-shimmer min-h-[400px]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <h1 className="text-lg font-medium text-heading mb-8 max-w-2xl mx-auto">{isEdit ? 'Редактировать игру' : 'Новая игра'}</h1>
      {errors.length > 0 && (
        <div className="max-w-2xl mx-auto rounded-xl border border-red-500/25 bg-red-500/10 p-4 mb-6">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-400">{e}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto glass-card rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1.5">Название</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Описание</label>
          <textarea rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Разработчик</label>
            <input value={form.developer} onChange={e => setForm(p => ({ ...p, developer: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Издатель</label>
            <input value={form.publisher} onChange={e => setForm(p => ({ ...p, publisher: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Дата выхода</label>
            <input type="date" value={form.release_date} onChange={e => setForm(p => ({ ...p, release_date: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">URL обложки</label>
            <input value={form.cover_image} onChange={e => setForm(p => ({ ...p, cover_image: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Жанры</label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {genres.map(g => (
              <label key={g.id} className="inline-flex items-center gap-2 cursor-pointer text-sm text-body select-none">
                <input
                  type="checkbox"
                  checked={form.genre_ids.includes(g.id)}
                  onChange={() => toggleGenre(g.id)}
                  className="accent-brand-500 rounded border-contrast/20"
                />
                <span>{g.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
            {isEdit ? 'Сохранить' : 'Создать'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors text-sm font-medium">
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
