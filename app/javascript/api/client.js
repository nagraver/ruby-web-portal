function getCSRFToken() {
  const meta = document.querySelector('meta[name="csrf-token"]')
  return meta ? meta.getAttribute('content') : ''
}

async function request(url, options = {}) {
  const defaults = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': getCSRFToken(),
    },
    credentials: 'same-origin',
  }

  const config = {
    ...defaults,
    ...options,
    headers: { ...defaults.headers, ...options.headers },
  }

  const response = await fetch(url, config)

  if (response.status === 204) return null

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.error || 'Ошибка запроса')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  patch: (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),
}
