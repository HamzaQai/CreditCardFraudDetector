import { useState, useEffect } from 'react'
import { Search, Plus, Pill } from 'lucide-react'
import { supplementsService, userSupplementsService } from '../services/api'
import CategoryBadge from '../components/CategoryBadge'

function SupplementsDatabase() {
  const [supplements, setSupplements] = useState([])
  const [filteredSupplements, setFilteredSupplements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedSupplement, setSelectedSupplement] = useState(null)

  useEffect(() => {
    loadSupplements()
  }, [])

  useEffect(() => {
    filterSupplements()
  }, [searchTerm, categoryFilter, supplements])

  const loadSupplements = async () => {
    try {
      const data = await supplementsService.getAll()
      setSupplements(data.supplements)
      setFilteredSupplements(data.supplements)
    } catch (error) {
      console.error('Error loading supplements:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSupplements = () => {
    let filtered = supplements

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(s => s.category === categoryFilter)
    }

    setFilteredSupplements(filtered)
  }

  const handleAddToStack = async (supplement) => {
    setSelectedSupplement(supplement)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Base de données</h1>
          <p className="text-secondary-600 mt-1">
            Parcourez plus de {supplements.length} compléments alimentaires
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Rechercher un complément..."
                className="input pl-12 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes catégories</option>
              <option value="vitamin">Vitamines</option>
              <option value="mineral">Minéraux</option>
              <option value="amino_acid">Acides aminés</option>
              <option value="omega">Oméga</option>
              <option value="plant">Plantes</option>
              <option value="probiotic">Probiotiques</option>
              <option value="other">Autres</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-secondary-600 mb-4">
          {filteredSupplements.length} complément{filteredSupplements.length > 1 ? 's' : ''} trouvé{filteredSupplements.length > 1 ? 's' : ''}
        </p>

        {/* Supplements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupplements.map((supp) => (
            <SupplementCard
              key={supp.id}
              supplement={supp}
              onAdd={() => handleAddToStack(supp)}
            />
          ))}
        </div>

        {/* Add to Stack Modal */}
        {selectedSupplement && (
          <AddToStackModal
            supplement={selectedSupplement}
            onClose={() => setSelectedSupplement(null)}
          />
        )}
      </div>
    </div>
  )
}

function SupplementCard({ supplement, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-secondary-900 mb-2">{supplement.name}</h3>
          <CategoryBadge category={supplement.category} />
        </div>

        <div className="p-2 bg-primary-50 rounded-lg">
          <Pill className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
        {supplement.description}
      </p>

      {/* Benefits */}
      {supplement.benefits?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {supplement.benefits.slice(0, 3).map((benefit, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
              {benefit}
            </span>
          ))}
          {supplement.benefits.length > 3 && (
            <span className="text-xs px-2 py-1 bg-secondary-100 text-secondary-600 rounded-full">
              +{supplement.benefits.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs text-secondary-500">Dosage recommandé</p>
        <p className="text-sm font-medium text-secondary-900">
          {supplement.recommended_dosage} {supplement.dosage_unit}
        </p>
      </div>

      <button
        className="btn-primary w-full text-sm flex items-center justify-center gap-2"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4" />
        Ajouter à ma stack
      </button>
    </div>
  )
}

function AddToStackModal({ supplement, onClose }) {
  const [formData, setFormData] = useState({
    custom_dosage: `${supplement.recommended_dosage} ${supplement.dosage_unit}`,
    frequency: 'daily',
    time_of_day: supplement.best_time || 'morning',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await userSupplementsService.create({
        supplement_id: supplement.id,
        ...formData
      })
      window.location.href = '/my-stack' // Simple redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          Ajouter {supplement.name}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Dosage personnalisé
            </label>
            <input
              type="text"
              className="input"
              value={formData.custom_dosage}
              onChange={(e) => setFormData({ ...formData, custom_dosage: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Fréquence
            </label>
            <select
              className="select w-full"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="as_needed">Si besoin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Moment de la journée
            </label>
            <select
              className="select w-full"
              value={formData.time_of_day}
              onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value })}
            >
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
              <option value="evening">Soir</option>
              <option value="with_meal">Avec repas</option>
              <option value="empty_stomach">À jeun</option>
              <option value="anytime">N'importe quand</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              className="input"
              rows="3"
              placeholder="Ajoutez des notes personnelles..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SupplementsDatabase
