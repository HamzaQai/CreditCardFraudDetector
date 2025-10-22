import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pill, LayoutDashboard, Package, Database, User, Crown, CheckCircle, Calendar, TrendingUp, Sunrise, Sun, Moon, Check, Plus, MoreVertical, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { dashboardService, userSupplementsService } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

function Dashboard() {
  const { user, logout, isPremium } = useAuth()
  const [todayData, setTodayData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [today, stats] = await Promise.all([
        dashboardService.getToday(),
        dashboardService.getStats('week')
      ])
      setTodayData(today)
      setStatsData(stats)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTaken = async (userSupplementId, taken) => {
    try {
      if (!taken) {
        await userSupplementsService.logIntake(userSupplementId, {})
      }
      loadData() // Reload to update status
    } catch (error) {
      console.error('Error logging intake:', error)
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

  const stats = todayData?.stats || {}
  const schedule = todayData?.schedule || { morning: [], afternoon: [], evening: [], anytime: [] }

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-secondary-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Pill className="w-6 h-6 text-primary-600" />
          </div>
          <span className="text-xl font-bold text-secondary-900">SupTracker</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" to="/dashboard" active />
          <NavItem icon={<Package />} label="Ma Stack" to="/my-stack" />
          <NavItem icon={<Database />} label="Base de données" to="/supplements" />
          <NavItem icon={<User />} label="Profil" to="/profile" />
        </nav>

        {/* Upgrade CTA */}
        {!isPremium && (
          <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg">
            <Crown className="w-8 h-8 text-accent-500 mb-2" />
            <p className="font-semibold text-secondary-900 text-sm">Passez Premium</p>
            <p className="text-xs text-secondary-600 mt-1">Compléments illimités + détection d'interactions</p>
            <button className="btn-primary text-sm w-full mt-3">Découvrir</button>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Bonjour, {user?.name} 👋
            </h1>
            <p className="text-secondary-600 mt-1">
              {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-secondary-600">Streak actuel</p>
              <p className="text-2xl font-bold text-primary-600">🔥 {stats.current_streak || 0} jours</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<CheckCircle className="text-primary-600" />}
            label="Pris aujourd'hui"
            value={`${stats.taken_today || 0}/${stats.total_today || 0}`}
            bgColor="bg-primary-50"
          />

          <StatCard
            icon={<Package className="text-blue-600" />}
            label="Compléments actifs"
            value={statsData?.total_supplements || 0}
            bgColor="bg-blue-50"
          />

          <StatCard
            icon={<Calendar className="text-purple-600" />}
            label="Cette semaine"
            value={`${stats.adherence_week || 0}%`}
            subtitle="Taux d'adhérence"
            bgColor="bg-purple-50"
          />

          <StatCard
            icon={<TrendingUp className="text-amber-600" />}
            label="Streak record"
            value={`${stats.current_streak || 0} jours`}
            bgColor="bg-amber-50"
          />
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Programme du jour</h2>
            <Link to="/my-stack" className="text-primary-600 font-semibold flex items-center gap-2 hover:text-primary-700">
              <Plus className="w-5 h-5" />
              Ajouter
            </Link>
          </div>

          {stats.total_today === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-600 mb-4">Vous n'avez pas encore de compléments</p>
              <Link to="/supplements" className="btn-primary">
                Parcourir la base de données
              </Link>
            </div>
          ) : (
            <>
              {schedule.morning.length > 0 && (
                <TimeBlock
                  time="Matin"
                  icon={<Sunrise className="w-5 h-5" />}
                  supplements={schedule.morning}
                  onToggleTaken={handleToggleTaken}
                />
              )}

              {schedule.afternoon.length > 0 && (
                <TimeBlock
                  time="Après-midi"
                  icon={<Sun className="w-5 h-5" />}
                  supplements={schedule.afternoon}
                  onToggleTaken={handleToggleTaken}
                />
              )}

              {schedule.evening.length > 0 && (
                <TimeBlock
                  time="Soir"
                  icon={<Moon className="w-5 h-5" />}
                  supplements={schedule.evening}
                  onToggleTaken={handleToggleTaken}
                />
              )}

              {schedule.anytime.length > 0 && (
                <TimeBlock
                  time="N'importe quand"
                  icon={<Calendar className="w-5 h-5" />}
                  supplements={schedule.anytime}
                  onToggleTaken={handleToggleTaken}
                />
              )}
            </>
          )}
        </div>

        {/* Weekly Progress Chart */}
        {statsData?.adherence_data && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Progression hebdomadaire</h2>

            <div className="flex items-end justify-between h-48 gap-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => {
                const adherence = statsData.adherence_data[idx] || 0
                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary-200 rounded-t-lg transition-all hover:bg-primary-300 cursor-pointer"
                      style={{ height: `${adherence}%`, minHeight: '8px' }}
                      title={`${adherence}%`}
                    />
                    <p className="text-sm text-secondary-600 mt-2">{day}</p>
                    <p className="text-xs text-secondary-400">{adherence}%</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function NavItem({ icon, label, to, active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-primary-50 text-primary-600 font-semibold'
          : 'text-secondary-600 hover:bg-secondary-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function StatCard({ icon, label, value, subtitle, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-sm text-secondary-600 mt-2">{label}</p>
      <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function TimeBlock({ time, icon, supplements, onToggleTaken }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-secondary-100 rounded-lg">
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-secondary-900">{time}</h3>
        <span className="text-sm text-secondary-500">
          {supplements.filter(s => s.taken).length}/{supplements.length} pris
        </span>
      </div>

      <div className="space-y-3 pl-12">
        {supplements.map((supp) => (
          <SupplementItem key={supp.user_supplement_id} {...supp} onToggleTaken={onToggleTaken} />
        ))}
      </div>
    </div>
  )
}

function SupplementItem({ user_supplement_id, name, dosage, taken, onToggleTaken }) {
  return (
    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
      <div className="flex items-center gap-4">
        <button
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            taken
              ? 'bg-primary-600 border-primary-600'
              : 'border-secondary-300 hover:border-primary-400'
          }`}
          onClick={() => onToggleTaken(user_supplement_id, taken)}
        >
          {taken && <Check className="w-4 h-4 text-white" />}
        </button>

        <div>
          <p className={`font-medium ${taken ? 'text-secondary-500 line-through' : 'text-secondary-900'}`}>
            {name}
          </p>
          <p className="text-sm text-secondary-600">{dosage}</p>
        </div>
      </div>

      <button className="text-secondary-400 hover:text-secondary-600">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Dashboard
