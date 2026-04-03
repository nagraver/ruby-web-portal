import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/home').then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <HomeSkeleton />
  if (!data) return null

  return (
    <div className="animate-fade-in">
      <section className="py-32 sm:py-44">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-brand-600 mb-5 animate-slide-up">
            Portals
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto mb-10 animate-slide-up" style={{ animationDelay: '60ms' }}>
            Каталог игр, обзоры и новости из мира гейминга
          </p>
          <div className="flex items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '120ms' }}>
            <Link to="/games" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
              Каталог игр
            </Link>
            <Link to="/articles" className="px-6 py-2.5 rounded-full glass-card text-body text-sm font-medium hover:bg-[var(--glass-bg-hover)] transition-colors">
              Новости
            </Link>
          </div>
        </div>
      </section>

      {data.latest_articles?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <SectionHeader title="Последние новости" link="/articles" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.latest_articles.slice(0, 6).map((a, i) => (
              <Link
                key={a.id}
                to={`/articles/${a.id}`}
                className="glass-card rounded-2xl p-6 hover:bg-[var(--glass-bg-hover)] transition-colors group"
              >
                <div className="flex items-center gap-2 text-xs text-faint mb-3">
                  <span>{new Date(a.published_at).toLocaleDateString('ru-RU')}</span>
                  {a.game_title && <><span className="text-softer">·</span><span className="text-brand-600/70">{a.game_title}</span></>}
                </div>
                <h3 className="font-medium text-heading group-hover:text-brand-600 transition-colors mb-2 line-clamp-2">{a.title}</h3>
                <p className="text-sm text-muted line-clamp-2 mb-3">{a.body?.substring(0, 120)}</p>
                <span className="text-xs text-faint">{a.author}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.top_games?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <SectionHeader title="Лучшие игры" link="/games" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.top_games.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>
      )}

      {data.recent_games?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <SectionHeader title="Новинки" link="/games" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.recent_games.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 text-center">
        <p className="text-muted mb-5">Готовы присоединиться к сообществу?</p>
        <Link to="/register" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
          Создать аккаунт
        </Link>
      </section>
    </div>
  )
}

function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-medium text-heading">{title}</h2>
      {link && <Link to={link} className="text-sm text-brand-600 hover:text-brand-500 transition-colors">Все →</Link>}
    </div>
  )
}

function GameCard({ game }) {
  const rating = parseFloat(game.average_rating)
  return (
    <Link to={`/games/${game.id}`} className="glass-card rounded-2xl p-6 hover:bg-[var(--glass-bg-hover)] transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-heading group-hover:text-brand-600 transition-colors">{game.title}</h3>
        {rating > 0 && <span className="text-sm font-medium text-brand-600 tabular-nums">{rating.toFixed(1)}</span>}
      </div>
      {game.developer && <p className="text-xs text-faint mb-3">{game.developer}</p>}
      <div className="flex flex-wrap gap-1.5">
        {game.genres?.slice(0, 3).map(g => (
          <span key={g.id} className="px-2.5 py-0.5 text-[11px] rounded-full bg-contrast/[0.04] text-muted">{g.name}</span>
        ))}
      </div>
    </Link>
  )
}

function HomeSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="py-32 sm:py-44 text-center">
        <div className="h-14 w-48 rounded-xl mx-auto mb-5 skeleton-shimmer" />
        <div className="h-5 w-72 max-w-full rounded mx-auto mb-10 skeleton-shimmer" />
        <div className="flex gap-3 justify-center">
          <div className="h-10 w-28 rounded-full skeleton-shimmer" />
          <div className="h-10 w-24 rounded-full skeleton-shimmer" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="h-6 w-40 rounded-lg mb-6 skeleton-shimmer" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-36 rounded-2xl skeleton-shimmer" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
