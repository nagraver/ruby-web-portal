import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import Pagination from '../../components/Pagination'

export default function ArticlesList() {
  const [articles, setArticles] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const page = searchParams.get('page') || '1'

  useEffect(() => {
    setLoading(true)
    api.get(`/api/articles?page=${page}`).then(data => { setArticles(data.articles); setMeta(data.meta) }).finally(() => setLoading(false))
  }, [page])

  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-heading">Новости</h1>
            <p className="text-faint text-sm mt-1">Свежие материалы из мира гейминга</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/articles/new" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
              Написать статью
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-5">
            <div className="h-40 rounded-2xl skeleton-shimmer" />
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-32 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="glass-card rounded-2xl px-8 py-16 text-center">
            <p className="text-body text-lg">Новостей пока нет</p>
            <p className="text-muted text-sm mt-2">Скоро здесь появятся свежие публикации</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, i) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="block glass-card rounded-2xl p-5 sm:p-6 hover:bg-[var(--glass-bg-hover)] transition-colors"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted mb-3">
                  <span className="text-faint">
                    {new Date(article.published_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  {article.game_title && (
                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-contrast/[0.04] text-muted">
                      {article.game_title}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-medium text-heading mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-body text-sm line-clamp-3 mb-4">{article.body?.substring(0, 250)}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="text-muted">{article.author}</span>
                  <span className="text-faint text-xs">
                    {article.likes_count} лайков · {article.comments_count} комментариев
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Pagination meta={meta} onPageChange={(p) => setSearchParams({ page: p })} />
      </div>
    </div>
  )
}
