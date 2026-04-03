import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import Pagination from '../../components/Pagination'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function GamesList() {
  const [games, setGames] = useState([])
  const [genres, setGenres] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const page = searchParams.get('page') || '1'
  const genreId = searchParams.get('genre_id') || ''
  const query = searchParams.get('q') || ''
  const [search, setSearch] = useState(query)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (page !== '1') params.set('page', page)
    if (genreId) params.set('genre_id', genreId)
    if (query) params.set('q', query)
    api.get(`/api/games?${params}`).then(data => {
      setGames(data.games)
      setGenres(data.genres)
      setMeta(data.meta)
    }).finally(() => setLoading(false))
  }, [page, genreId, query])

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams(searchParams)
    if (search) p.set('q', search); else p.delete('q')
    p.delete('page')
    setSearchParams(p)
  }

  const handleGenre = (id) => {
    const p = new URLSearchParams(searchParams)
    if (id) p.set('genre_id', id); else p.delete('genre_id')
    p.delete('page')
    setSearchParams(p)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-lg font-medium text-heading">Каталог игр</h1>
          <p className="text-faint text-sm mt-1">{meta?.total_count || 0} игр в каталоге</p>
        </div>
        {user?.role === 'admin' && (
          <Link
            to="/games/new"
            className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors"
          >
            Добавить игру
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск игр..."
            className={`${inputClass}${search ? ' pr-24' : ''}`}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                const p = new URLSearchParams(searchParams)
                p.delete('q')
                p.delete('page')
                setSearchParams(p)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-faint hover:text-muted transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => handleGenre('')}
          className={
            !genreId
              ? 'px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors'
              : 'px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors'
          }
        >
          Все
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            type="button"
            onClick={() => handleGenre(g.id)}
            className={
              genreId == g.id
                ? 'px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors'
                : 'px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors'
            }
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl skeleton-shimmer min-h-[160px] p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-body text-lg">Игры не найдены</p>
          {query && <p className="text-sm text-faint mt-1">Попробуйте изменить запрос</p>}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map(game => {
            const rating = parseFloat(game.average_rating)
            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="glass-card rounded-2xl p-5 block hover:bg-[var(--glass-bg-hover)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-heading line-clamp-2">{game.title}</h3>
                  {rating > 0 && (
                    <span className="text-sm font-medium text-heading tabular-nums shrink-0">{rating.toFixed(1)}</span>
                  )}
                </div>
                {game.developer && (
                  <p className="text-sm text-muted mb-3 line-clamp-1">{game.developer}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {game.genres?.map(g => (
                    <span key={g.id} className="px-2 py-0.5 text-[11px] rounded-full bg-contrast/[0.04] text-muted">
                      {g.name}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <Pagination meta={meta} onPageChange={(p) => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp) }} />
    </div>
  )
}
