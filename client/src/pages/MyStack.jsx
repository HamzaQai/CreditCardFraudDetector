import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, AlertTriangle, Pill, Clock, Calendar, TrendingUp, Edit, Archive, Trash, MoreVertical } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userSupplementsService } from '../services/api'
import CategoryBadge from '../components/CategoryBadge'
import { formatDate, getFrequencyLabel, getTimeOfDayLabel } from '../utils/helpers'

function MyStack() {
  const { user, isPremium } = useAuth()
  const [supplements, setSupplements] = useState([])
  const [loading, setLoading] = useState(true)
  const maxSupplements = isPremium ? Infinity : 5

  useEffect(() => {
    loadSupplements()
  }, [])

  const loadSupplements = async () => {
    try {
      const data = await userSupplementsService.getAll()
      setSupplements(data.supplements)
    } catch (error) {
      console.error('Error loading supplements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce complément ?')) {
      try {
        await userSupplementsService.delete(id)
        loadSupplements()
      } catch (error) {
        console.error('Error deleting supplement:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Ma Stack</h1>
            <p className="text-secondary-600 mt-1">
              {supplements.length}/{isPremium ? '∞' : maxSupplements} compléments actifs
            </p>
          </div>

          <Link
            to="/supplements"
            className={`btn-primary flex items-center gap-2 ${
              supplements.length >= maxSupplements && !isPremium ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="w-5 h-5" />
            Ajouter un complément
          </Link>
        </div>

        {/* Warning for free users approaching limit */}
        {!isPremium && supplements.length >= 4 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Limite atteinte</p>
                <p className="text-sm text-amber-700 mt-1">
                  Vous avez {supplements.length}/5 compléments.
                  Passez Premium pour des compléments illimités et la détection d'interactions.
                </p>
                <button className="btn-primary text-sm mt-3">Passer Premium</button>
              </div>
            </div>
          </div>
        )}

        {supplements.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Pill className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-secondary-900 mb-2">Aucun complément</h2>
            <p className="text-secondary-600 mb-6">
              Commencez par ajouter des compléments depuis la base de données
            </p>
            <Link to="/supplements" className="btn-primary">
              Parcourir la base de données
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplements.map((supp) => (
              <SupplementCard
                key={supp.id}
                supplement={supp}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SupplementCard({ supplement, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-secondary-900 mb-2">{supplement.supplement_name}</h3>
          <CategoryBadge category={supplement.category} />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-20">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary-50 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary-50 flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archiver
                </button>
                <button
                  onClick={() => onDelete(supplement.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <InfoRow icon={<Pill />} label="Dosage" value={supplement.custom_dosage} />
        <InfoRow icon={<Clock />} label="Fréquence" value={getFrequencyLabel(supplement.frequency)} />
        <InfoRow icon={<Clock />} label="Moment" value={getTimeOfDayLabel(supplement.time_of_day)} />
        <InfoRow icon={<Calendar />} label="Depuis" value={formatDate(supplement.start_date)} />
      </div>

      {supplement.notes && (
        <div className="pt-4 border-t border-secondary-100 mb-4">
          <p className="text-sm text-secondary-600">{supplement.notes}</p>
        </div>
      )}

      <div className="pt-4 border-t border-secondary-100">
        <button className="text-primary-600 font-semibold text-sm flex items-center gap-2 hover:text-primary-700">
          <TrendingUp className="w-4 h-4" />
          Voir les statistiques
        </button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="text-secondary-400">
        {icon}
      </div>
      <div>
        <span className="text-secondary-500">{label}: </span>
        <span className="text-secondary-900 font-medium">{value}</span>
      </div>
    </div>
  )
}

export default MyStack
