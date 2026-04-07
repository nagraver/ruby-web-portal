import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { useFlash } from '../../components/FlashMessage'
import { StarInput, StarDisplay } from '../../components/StarRating'
import Pagination from '../../components/Pagination'

const inputClass =
  'w-full bg-contrast/[0.03] border border-contrast/8 rounded-xl px-4 py-3 text-heading placeholder-faint focus:outline-none focus:border-brand-500/40 transition-colors'

export default function GameShow() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [reviews, setReviews] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ title: '', body: '', rating: 5 })
  const [reviewErrors, setReviewErrors] = useState([])
  const [editingReview, setEditingReview] = useState(null)
  const [commentForms, setCommentForms] = useState({})

  const fetchGame = () => {
    api.get(`/api/games/${id}?page=${page}`).then(data => {
      setGame(data.game); setReviews(data.reviews); setMeta(data.meta)
    }).catch(() => navigate('/games')).finally(() => setLoading(false))
  }
  useEffect(() => { fetchGame() }, [id, page])

  const handleDeleteGame = async () => { if (!confirm('Удалить игру?')) return; await api.delete(`/api/games/${id}`); showFlash('Игра удалена'); navigate('/games') }

  const handleSubmitReview = async (e) => {
    e.preventDefault(); setReviewErrors([])
    try {
      if (editingReview) { await api.patch(`/api/games/${id}/reviews/${editingReview.id}`, { review: reviewForm }); showFlash('Отзыв обновлён') }
      else { await api.post(`/api/games/${id}/reviews`, { review: reviewForm }); showFlash('Отзыв добавлен') }
      setShowReviewForm(false); setEditingReview(null); setReviewForm({ title: '', body: '', rating: 5 }); fetchGame()
    } catch (err) { setReviewErrors(err.data?.errors || [err.message]) }
  }

  const handleDeleteReview = async (rid) => { if (!confirm('Удалить отзыв?')) return; await api.delete(`/api/games/${id}/reviews/${rid}`); showFlash('Отзыв удалён'); fetchGame() }
  const handleEditReview = (r) => { setEditingReview(r); setReviewForm({ title: r.title, body: r.body, rating: r.rating }); setShowReviewForm(true) }

  const handleAddComment = async (rid) => {
    const body = commentForms[rid]; if (!body?.trim()) return
    try { await api.post(`/api/games/${id}/reviews/${rid}/comments`, { comment: { body } }); setCommentForms(p => ({ ...p, [rid]: '' })); fetchGame() }
    catch (err) { showFlash(err.message, 'error') }
  }
  const handleDeleteComment = async (rid, cid) => { await api.delete(`/api/games/${id}/reviews/${rid}/comments/${cid}`); fetchGame() }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        <div className="glass-card rounded-2xl skeleton-shimmer min-h-[280px]" />
      </div>
    )
  }
  if (!game) return null

  const rating = parseFloat(game.average_rating)
  const userHasReview = reviews.some(r => r.user_id === user?.id)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-lg font-medium text-heading">{game.title}</h1>
            {rating > 0 && (
              <p className="text-sm text-muted mt-2 tabular-nums">
                Средняя оценка: <span className="text-heading font-medium">{rating.toFixed(1)}</span>
                <span className="text-faint"> /10</span>
              </p>
            )}
          </div>
          {user?.role === 'admin' && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                to={`/games/${id}/edit`}
                className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors text-sm font-medium"
              >
                Изменить
              </Link>
              <button
                type="button"
                onClick={handleDeleteGame}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-red-400 hover:text-red-300 bg-contrast/[0.03] border border-red-500/20 transition-colors"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {game.genres?.map(g => (
            <span key={g.id} className="px-2 py-0.5 text-[11px] rounded-full bg-contrast/[0.04] text-muted">
              {g.name}
            </span>
          ))}
        </div>
        {game.description && <p className="text-body leading-relaxed mb-6">{game.description}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'Разработчик', value: game.developer },
            { label: 'Издатель', value: game.publisher },
            { label: 'Дата выхода', value: game.release_date && new Date(game.release_date).toLocaleDateString('ru-RU') },
            { label: 'Отзывов', value: game.reviews_count },
          ].filter(x => x.value).map(x => (
            <div key={x.label} className="rounded-xl bg-contrast/[0.03] border border-contrast/8 px-3 py-2.5">
              <p className="text-xs text-faint mb-0.5">{x.label}</p>
              <p className="text-heading font-medium">{x.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-medium text-heading">Отзывы</h2>
        {user && !userHasReview && !showReviewForm && (
          <button
            type="button"
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors w-fit"
          >
            Написать отзыв
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-medium text-heading mb-4">{editingReview ? 'Изменить отзыв' : 'Новый отзыв'}</h3>
          {reviewErrors.length > 0 && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 mb-4">
              {reviewErrors.map((e, i) => (
                <p key={i} className="text-sm text-red-400">{e}</p>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">Оценка</label>
              <StarInput value={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Заголовок</label>
              <input
                value={reviewForm.title}
                onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Текст</label>
              <textarea
                rows={4}
                value={reviewForm.body}
                onChange={e => setReviewForm(p => ({ ...p, body: e.target.value }))}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
                {editingReview ? 'Сохранить' : 'Отправить'}
              </button>
              <button
                type="button"
                onClick={() => { setShowReviewForm(false); setEditingReview(null) }}
                className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors text-sm font-medium"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-center text-faint py-16">Отзывов пока нет — будьте первым!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-heading">{review.title}</h3>
                  <div className="mt-2">
                    <StarDisplay rating={review.rating} size="sm" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <Link to={`/profile/${review.username}`} className="text-sm text-body hover:text-heading transition-colors">
                      {review.username}
                    </Link>
                    <span className="text-xs text-faint">{new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                {(user?.id === review.user_id || user?.role === 'admin') && (
                  <div className="flex gap-3 shrink-0">
                    {user?.id === review.user_id && (
                      <button type="button" onClick={() => handleEditReview(review)} className="text-xs text-muted hover:text-heading transition-colors">
                        Изменить
                      </button>
                    )}
                    <button type="button" onClick={() => handleDeleteReview(review.id)} className="text-xs text-red-500/70 hover:text-red-400 transition-colors">
                      Удалить
                    </button>
                  </div>
                )}
              </div>
              <p className="text-body text-sm leading-relaxed mb-4">{review.body}</p>

              {review.comments?.length > 0 && (
                <div className="border-t border-contrast/8 pt-4 mt-4 space-y-3">
                  {review.comments.map(c => (
                    <div key={c.id} className="flex gap-3 pl-3 border-l border-contrast/10">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link to={`/profile/${c.username}`} className="text-sm font-medium text-body hover:text-heading transition-colors">
                            {c.username}
                          </Link>
                          <span className="text-xs text-faint">{new Date(c.created_at).toLocaleDateString('ru-RU')}</span>
                          {(user?.id === c.user_id || user?.role === 'admin') && (
                            <button type="button" onClick={() => handleDeleteComment(review.id, c.id)} className="text-xs text-red-500/50 hover:text-red-400 ml-auto sm:ml-0">
                              Удалить
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-muted mt-1">{c.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <input
                    value={commentForms[review.id] || ''}
                    onChange={e => setCommentForms(p => ({ ...p, [review.id]: e.target.value }))}
                    placeholder="Комментарий..."
                    className={`${inputClass} flex-1 py-2.5 text-sm`}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment(review.id)}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddComment(review.id)}
                    className="px-6 py-2.5 rounded-full glass-card text-body hover:text-heading hover:bg-[var(--glass-bg-hover)] transition-colors text-sm font-medium shrink-0"
                  >
                    Отправить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}
