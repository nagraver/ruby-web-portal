import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useFlash } from '../../components/FlashMessage'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function GenreForm() {
  const { id } = useParams()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const isEdit = !!id
  const [name, setName] = useState('')
  const [errors, setErrors] = useState([])

  useEffect(() => { if (isEdit) api.get(`/api/genres/${id}`).then(data => setName(data.genre.name)) }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors([])
    try {
      if (isEdit) { await api.patch(`/api/genres/${id}`, { genre: { name } }); showFlash('Жанр обновлён') }
      else { await api.post('/api/genres', { genre: { name } }); showFlash('Жанр создан') }
      navigate('/genres')
    } catch (err) { setErrors(err.data?.errors || [err.message]) }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <h1 className="text-lg font-medium text-heading mb-8">{isEdit ? 'Изменить жанр' : 'Новый жанр'}</h1>

      {errors.length > 0 && (
        <div className="space-y-1 mb-6">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-500">{e}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5 max-w-md">
        <div>
          <label className="block text-sm text-muted mb-1.5" htmlFor="genre-name">Название</label>
          <input
            id="genre-name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors disabled:opacity-50"
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/genres')}
            className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
