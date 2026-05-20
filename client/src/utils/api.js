import { getToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Network error. Make sure the server is running.')
  }

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = { message: 'Unexpected server response' }
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong')
    error.errors = data.errors || null
    throw error
  }

  return data
}
