import { useAuth } from '../context/AuthContext'
import { User, Mail, Crown, Calendar } from 'lucide-react'
import { formatDate } from '../utils/helpers'

function Profile() {
  const { user, isPremium } = useAuth()

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Profil</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-secondary-200">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                {isPremium ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                    <Crown className="w-4 h-4" />
                    Premium
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                    Gratuit
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow icon={<Mail />} label="Email" value={user?.email} />
            <InfoRow icon={<Calendar />} label="Membre depuis" value={formatDate(user?.created_at)} />
          </div>

          {!isPremium && (
            <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg">
              <div className="flex items-start gap-4">
                <Crown className="w-8 h-8 text-accent-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-secondary-900 mb-2">Passez Premium</h3>
                  <ul className="space-y-2 mb-4 text-sm text-secondary-700">
                    <li>✓ Compléments illimités</li>
                    <li>✓ Détection d'interactions</li>
                    <li>✓ Recommandations personnalisées</li>
                    <li>✓ Analyses avancées</li>
                    <li>✓ Support prioritaire</li>
                  </ul>
                  <button className="btn-primary">
                    Passer à Premium - 7,99€/mois
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-secondary-100 rounded-lg text-secondary-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-secondary-500">{label}</p>
        <p className="font-medium text-secondary-900">{value}</p>
      </div>
    </div>
  )
}

export default Profile
