import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

export default function GenresList() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { showFlash } = useFlash()

  const fetchGenres = () => { api.get('/api/genres').then(data => setGenres(data.genres)).finally(() => setLoading(false)) }
  useEffect(() => { fetchGenres() }, [])

  const handleDelete = async (id) => { if (!confirm('Удалить жанр?')) return; await api.delete(`/api/genres/${id}`); showFlash('Жанр удалён'); fetchGenres() }

  if (user?.role !== 'admin') {
    return (
      <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-center text-faint py-20">Доступ запрещён</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-lg font-medium text-heading">Жанры</h1>
        <Link
          to="/genres/new"
          className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors"
        >
          + Добавить
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-14 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      ) : genres.length === 0 ? (
        <p className="text-center text-faint py-20">Жанров пока нет</p>
      ) : (
        <div className="glass-card rounded-2xl divide-y divide-[var(--card-border)] overflow-hidden">
          {genres.map((g) => (
            <div key={g.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <span className="font-medium text-heading">{g.name}</span>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  to={`/genres/${g.id}/edit`}
                  className="text-sm text-muted hover:text-heading transition-colors"
                >
                  Изменить
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(g.id)}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
