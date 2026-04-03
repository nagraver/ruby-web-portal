import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

const tabBtn = (active) =>
  `pb-3 px-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
    active ? 'text-heading border-brand-600' : 'text-muted border-transparent hover:text-body'
  }`

export default function ProfileShow() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => { setLoading(true); api.get(`/api/profiles/${username}`).then(setProfile).finally(() => setLoading(false)) }, [username])

  useEffect(() => {
    if (!profile) return
    const hasArticles = profile.recent_articles !== undefined
    if (activeTab === 'articles' && !hasArticles) setActiveTab('reviews')
  }, [profile, activeTab])

  if (loading) return <ProfileSkeleton />
  if (!profile) return <p className="text-center text-faint py-20">Пользователь не найден</p>

  const isOwnProfile = currentUser?.id === profile.user.id
  const initials = profile.user.username.slice(0, 2).toUpperCase()
  const hasArticles = profile.recent_articles !== undefined
  const reviews = profile.recent_reviews || []
  const articles = profile.recent_articles || []
  const commentsCount = profile.stats?.comments_count ?? 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center text-2xl font-semibold text-white shrink-0"
            aria-hidden
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium text-heading flex items-center gap-3 flex-wrap">
              {profile.user.username}
              {profile.user.role === 'admin' && (
                <span className="px-2 py-0.5 text-[11px] rounded-full bg-contrast/[0.04] text-muted font-medium normal-case">
                  Администратор
                </span>
              )}
            </h1>
            <p className="text-sm text-muted mt-1">
              На портале с {new Date(profile.user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          {isOwnProfile && (
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Редактировать
            </Link>
          )}
        </div>
      </div>

      <div
        className={`grid gap-4 mb-8 ${profile.stats.articles_count != null ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}
      >
        <div className="glass-card rounded-2xl p-5">
          <p className="text-3xl font-semibold text-heading">{profile.stats.reviews_count}</p>
          <p className="text-sm text-muted mt-1">Отзывов</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-3xl font-semibold text-heading">{profile.stats.comments_count}</p>
          <p className="text-sm text-muted mt-1">Комментариев</p>
        </div>
        {profile.stats.articles_count != null && (
          <div className="glass-card rounded-2xl p-5">
            <p className="text-3xl font-semibold text-heading">{profile.stats.articles_count}</p>
            <p className="text-sm text-muted mt-1">Статей</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-0 border-b border-[var(--card-border)] mb-6">
        <button type="button" className={tabBtn(activeTab === 'reviews')} onClick={() => setActiveTab('reviews')}>
          Отзывы
        </button>
        {hasArticles && (
          <button type="button" className={tabBtn(activeTab === 'articles')} onClick={() => setActiveTab('articles')}>
            Статьи
          </button>
        )}
        <button type="button" className={tabBtn(activeTab === 'comments')} onClick={() => setActiveTab('comments')}>
          Комментарии
        </button>
      </div>

      {activeTab === 'reviews' && (
        <section>
          <h2 className="text-lg font-medium text-heading mb-4">Последние отзывы</h2>
          {reviews.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-muted text-sm">Нет отзывов</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <Link
                  key={r.id}
                  to={`/games/${r.game_id}`}
                  className="flex items-center gap-4 glass-card rounded-2xl p-4 hover:bg-[var(--glass-bg-hover)] transition-colors"
                >
                  <span className="text-sm font-medium text-heading tabular-nums w-8 shrink-0">{r.rating}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-heading truncate">{r.title}</p>
                    <p className="text-sm text-muted truncate">{r.game_title}</p>
                  </div>
                  <span className="text-xs text-faint shrink-0 hidden sm:inline">
                    {new Date(r.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'articles' && hasArticles && (
        <section>
          <h2 className="text-lg font-medium text-heading mb-4">Статьи</h2>
          {articles.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-muted text-sm">Нет статей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  to={`/articles/${a.id}`}
                  className="flex items-center justify-between gap-4 glass-card rounded-2xl p-4 hover:bg-[var(--glass-bg-hover)] transition-colors"
                >
                  <span className="font-medium text-heading truncate">{a.title}</span>
                  <span className="text-sm text-faint shrink-0">{new Date(a.published_at).toLocaleDateString('ru-RU')}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'comments' && (
        <section>
          <h2 className="text-lg font-medium text-heading mb-4">Комментарии</h2>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-body">
              Всего комментариев: <span className="text-heading font-medium tabular-nums">{commentsCount}</span>
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-48 skeleton-shimmer rounded-xl max-w-full" />
            <div className="h-4 w-36 skeleton-shimmer rounded-xl max-w-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 skeleton-shimmer rounded-2xl" />
        ))}
      </div>
      <div className="h-10 w-full max-w-md skeleton-shimmer rounded-2xl" />
    </div>
  )
}
