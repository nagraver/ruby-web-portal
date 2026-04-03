import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'

export default function ArticleShow() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentBody, setCommentBody] = useState('')

  const fetchArticle = () => {
    api.get(`/api/articles/${id}`).then(data => { setArticle(data.article); setComments(data.comments) }).catch(() => navigate('/articles')).finally(() => setLoading(false))
  }
  useEffect(() => { fetchArticle() }, [id])

  const handleDelete = async () => { if (!confirm('Удалить статью?')) return; await api.delete(`/api/articles/${id}`); showFlash('Статья удалена'); navigate('/articles') }

  const handleLike = async () => {
    try {
      if (article.liked_by_user) await api.delete(`/api/articles/${id}/like`)
      else await api.post(`/api/articles/${id}/like`)
      fetchArticle()
    } catch (err) { showFlash(err.message, 'error') }
  }

  const handleAddComment = async (e) => {
    e.preventDefault(); if (!commentBody.trim()) return
    try { await api.post(`/api/articles/${id}/comments`, { comment: { body: commentBody } }); setCommentBody(''); fetchArticle() }
    catch (err) { showFlash(err.message, 'error') }
  }

  const handleDeleteComment = async (cid) => { await api.delete(`/api/articles/${id}/comments/${cid}`); fetchArticle() }

  const inputClass =
    'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div className="h-10 max-w-md rounded-2xl skeleton-shimmer" />
          <div className="h-64 rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    )
  }
  if (!article) return null

  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <article className="glass-card rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {article.game_title && (
              <Link
                to={`/games/${article.game_id}`}
                className="px-2 py-0.5 text-[11px] rounded-full bg-contrast/[0.04] text-muted hover:text-heading transition-colors"
              >
                {article.game_title}
              </Link>
            )}
            <span className="text-faint text-sm">
              {new Date(article.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-6 leading-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-contrast/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-contrast/[0.06] flex items-center justify-center text-sm font-medium text-heading">
                {article.author[0].toUpperCase()}
              </div>
              <div>
                <Link to={`/profile/${article.author}`} className="text-sm font-medium text-heading hover:text-brand-600 transition-colors">
                  {article.author}
                </Link>
                <p className="text-xs text-faint">Автор</p>
              </div>
            </div>
            {user?.role === 'admin' && (
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/articles/${id}/edit`}
                  className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors text-sm font-medium"
                >
                  Изменить
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>

          <div className="text-body leading-relaxed text-[15px] whitespace-pre-wrap mb-8">{article.body}</div>

          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-contrast/8">
            {user ? (
              <button
                type="button"
                onClick={handleLike}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  article.liked_by_user
                    ? 'bg-brand-600/15 text-brand-600 border border-brand-500/30'
                    : 'glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)]'
                }`}
              >
                Нравится · {article.likes_count}
              </button>
            ) : (
              <span className="text-sm text-muted">Нравится · {article.likes_count}</span>
            )}
            <span className="text-sm text-muted">Комментарии · {comments.length}</span>
          </div>
        </article>

        <section>
          <h2 className="text-lg font-medium text-heading mb-6">Комментарии</h2>
          {user && (
            <form onSubmit={handleAddComment} className="mb-8 glass-card rounded-2xl p-4 sm:p-5">
              <label htmlFor="comment-body" className="block text-sm text-muted mb-1.5">
                Ваш комментарий
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <textarea
                  id="comment-body"
                  rows={2}
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  placeholder="Написать комментарий..."
                  className={`${inputClass} resize-none flex-1 min-h-[2.75rem]`}
                />
                <button type="submit" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors shrink-0">
                  Отправить
                </button>
              </div>
            </form>
          )}

          {comments.length === 0 ? (
            <p className="text-center text-muted py-10">Комментариев пока нет</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="glass-card rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/profile/${c.username}`} className="text-sm font-medium text-heading hover:text-brand-600 transition-colors">
                        {c.username}
                      </Link>
                      <span className="text-xs text-faint">{new Date(c.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {(user?.id === c.user_id || user?.role === 'admin') && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-xs text-red-400/80 hover:text-red-400 transition-colors"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-body">{c.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
