import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

function AnimatedNumber({ value, duration = 700 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (value == null) return
    const startTime = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) ref.current = requestAnimationFrame(animate)
    }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [value, duration])

  return <>{display.toLocaleString('ru-RU')}</>
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
  }, [user])

  useEffect(() => {
    api.get('/api/admin/dashboard').then(setData).catch(() => navigate('/')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton />
  if (!data) return null

  const stats = [
    { key: 'users', label: 'Пользователи', value: data.users_count },
    { key: 'games', label: 'Игры', value: data.games_count },
    { key: 'articles', label: 'Статьи', value: data.articles_count },
    { key: 'reviews', label: 'Отзывы', value: data.reviews_count },
    { key: 'comments', label: 'Комментарии', value: data.comments_count },
    { key: 'likes', label: 'Лайки', value: data.likes_count || 0 },
  ]

  const activity = data.weekly_activity || []
  const maxA = Math.max(...activity.map(d => d.reviews + d.comments + d.users), 1)

  const tabs = [
    { id: 'reviews', label: 'Отзывы', count: data.recent_reviews?.length },
    { id: 'articles', label: 'Статьи', count: data.recent_articles?.length },
    { id: 'users', label: 'Пользователи', count: data.recent_users?.length },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-heading">Панель управления</h1>
          <p className="text-sm text-faint mt-0.5">Привет, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/games/new" className="px-4 py-2 rounded-full glass-card text-sm text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors">+ Игра</Link>
          <Link to="/articles/new" className="px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">+ Статья</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {stats.map((s, i) => (
          <div key={s.key} className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
            <p className="text-2xl font-semibold text-heading tabular-nums">
              <AnimatedNumber value={s.value} duration={500 + i * 80} />
            </p>
            <p className="text-[11px] text-faint mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mb-8">
        <div className="lg:col-span-3 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-heading">Активность за неделю</h2>
            <div className="flex items-center gap-4 text-[11px] text-faint">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-500" />Отзывы</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Комментарии</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-28">
            {activity.map((d, i) => {
              const rH = maxA > 0 ? (d.reviews / maxA) * 100 : 0
              const cH = maxA > 0 ? (d.comments / maxA) * 100 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-[2px] h-20">
                    <div className="w-2 rounded-t bg-brand-500/60 transition-all duration-500" style={{ height: `${Math.max(rH, 4)}%` }} />
                    <div className="w-2 rounded-t bg-emerald-500/60 transition-all duration-500" style={{ height: `${Math.max(cH, 4)}%` }} />
                  </div>
                  <span className="text-[10px] text-faint">{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--card-border)]">
            <h2 className="text-sm font-medium text-heading">Топ игр</h2>
          </div>
          {data.top_games?.length > 0 ? (
            <div className="divide-y divide-[var(--card-border)]">
              {data.top_games.map((g, i) => (
                <Link key={g.id} to={`/games/${g.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--glass-bg-hover)] transition-colors">
                  <span className="text-xs text-faint w-4 text-right tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-heading truncate">{g.title}</p>
                    <p className="text-[11px] text-faint">{g.reviews_count} отз.</p>
                  </div>
                  <span className="text-sm font-medium text-brand-600 tabular-nums">{parseFloat(g.average_rating).toFixed(1)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-faint">Нет оценённых игр</p>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mb-8">
        <div className="flex items-center border-b border-[var(--card-border)]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3.5 text-sm transition-colors ${
                activeTab === tab.id ? 'text-heading font-medium' : 'text-faint hover:text-body'
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-1.5 text-[10px] text-faint">{tab.count}</span>}
              {activeTab === tab.id && <span className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-brand-600 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[var(--card-border)]">
          {activeTab === 'reviews' && data.recent_reviews?.map(r => (
            <Link key={r.id} to={`/games/${r.game_id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--glass-bg-hover)] transition-colors">
              <span className="text-sm font-medium text-brand-600 tabular-nums w-6 text-center">{r.rating}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-heading truncate">{r.title}</p>
                <p className="text-xs text-faint truncate">{r.body}</p>
              </div>
              <div className="hidden sm:block text-right flex-shrink-0">
                <p className="text-xs text-muted">{r.username}</p>
                <p className="text-[11px] text-faint">{r.game_title}</p>
              </div>
            </Link>
          ))}

          {activeTab === 'articles' && data.recent_articles?.map(a => (
            <Link key={a.id} to={`/articles/${a.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--glass-bg-hover)] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-heading truncate">{a.title}</p>
                <p className="text-xs text-faint">{a.author}{a.game_title && ` · ${a.game_title}`}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-faint flex-shrink-0">
                <span>♥ {a.likes_count}</span>
                <span>💬 {a.comments_count}</span>
              </div>
            </Link>
          ))}

          {activeTab === 'users' && data.recent_users?.map(u => (
            <Link key={u.id} to={`/profile/${u.username}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--glass-bg-hover)] transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-700">
                {u.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-heading">{u.username}</p>
                <p className="text-[11px] text-faint">{new Date(u.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
              {u.role === 'admin' && <span className="text-[10px] text-brand-600 font-medium">admin</span>}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { to: '/games/new', label: 'Добавить игру' },
          { to: '/articles/new', label: 'Написать статью' },
          { to: '/genres', label: 'Управление жанрами' },
          { to: '/games', label: 'Каталог игр' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="glass-card rounded-2xl px-5 py-4 text-sm text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors">
            {a.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="h-12 w-56 rounded-xl mb-8 skeleton-shimmer" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-20 rounded-2xl skeleton-shimmer" style={{ animationDelay: `${i * 80}ms` }} />)}
      </div>
      <div className="grid lg:grid-cols-5 gap-4 mb-8">
        <div className="lg:col-span-3 h-48 rounded-2xl skeleton-shimmer" />
        <div className="lg:col-span-2 h-48 rounded-2xl skeleton-shimmer" />
      </div>
      <div className="h-56 rounded-2xl skeleton-shimmer" />
    </div>
  )
}
