import React from 'react'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total_pages <= 1) return null

  const { current_page, total_pages } = meta
  const pages = []
  const start = Math.max(1, current_page - 2)
  const end = Math.min(total_pages, current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  const base = 'w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-colors'
  const active = 'bg-brand-600 text-white'
  const inactive = 'text-muted hover:text-heading hover:bg-contrast/5'
  const disabled = 'text-softer cursor-not-allowed'

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button onClick={() => onPageChange(current_page - 1)} disabled={current_page === 1} className={`${base} ${current_page === 1 ? disabled : inactive}`}>&laquo;</button>
      {start > 1 && <><button onClick={() => onPageChange(1)} className={`${base} ${inactive}`}>1</button>{start > 2 && <span className="px-1 text-softer text-xs">&hellip;</span>}</>}
      {pages.map(p => <button key={p} onClick={() => onPageChange(p)} className={`${base} ${p === current_page ? active : inactive}`}>{p}</button>)}
      {end < total_pages && <>{end < total_pages - 1 && <span className="px-1 text-softer text-xs">&hellip;</span>}<button onClick={() => onPageChange(total_pages)} className={`${base} ${inactive}`}>{total_pages}</button></>}
      <button onClick={() => onPageChange(current_page + 1)} disabled={current_page === total_pages} className={`${base} ${current_page === total_pages ? disabled : inactive}`}>&raquo;</button>
    </div>
  )
}
