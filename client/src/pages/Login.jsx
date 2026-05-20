import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import ErrorBox from '../components/ErrorBox'
import FieldError from '../components/FieldError'
import { apiFetch } from '../utils/api'
import { setAuth } from '../utils/auth'
import { validateLogin, inputClass } from '../utils/validation'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    const errors = validateLogin({
      email,
      password,
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      setAuth(data.token, data.user)

      toast.success('Welcome back!')

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)

      toast.error(err.message)

      if (err.errors) {
        setFieldErrors(err.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-glow">
        <h1 className="text-2xl font-semibold text-white">
          FlowBooks
        </h1>

        <p className="text-sm text-muted mt-2">
          Sign in to your account
        </p>

        <div className="mt-4">
          <ErrorBox message={error} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-muted mb-1.5"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={inputClass(fieldErrors.email)}
            />

            <FieldError message={fieldErrors.email} />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-muted mb-1.5"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass(fieldErrors.password)}
            />

            <FieldError message={fieldErrors.password} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-accent text-background text-sm font-medium py-2.5 rounded-lg hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          No account yet?{' '}
          <Link
            to="/register"
            className="text-accent hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}