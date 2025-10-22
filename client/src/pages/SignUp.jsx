import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pill, User, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'

function SignUp() {
  const navigate = useNavigate()
  const { signup, error: authError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
            <Pill className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900">Créer un compte</h1>
          <p className="text-secondary-600 mt-2">Commencez à optimiser votre santé</p>
        </div>

        {(error || authError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error || authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nom complet"
            type="text"
            name="name"
            placeholder="Jean Dupont"
            icon={<User className="w-5 h-5" />}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="jean@example.com"
            icon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'S\'inscrire gratuitement'}
          </button>
        </form>

        <p className="text-center text-secondary-600 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
