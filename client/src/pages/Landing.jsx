import { Link } from 'react-router-dom'
import { Pill, Calendar, Shield, TrendingUp, Check, Crown } from 'lucide-react'

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-secondary-900">SupTracker</span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-secondary-700 hover:text-secondary-900 font-medium">
                Se connecter
              </Link>
              <Link to="/signup" className="btn-primary">
                S'inscrire
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
            Gérez vos compléments<br />alimentaires intelligemment
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Optimisez votre santé. Économisez de l'argent. Obtenez des résultats.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Commencer gratuitement
            </Link>
            <a href="#features" className="btn-outline text-lg px-8 py-4">
              En savoir plus
            </a>
          </div>

          {/* Pills illustration */}
          <div className="mt-20 flex justify-center gap-8 opacity-50">
            <Pill className="w-16 h-16 text-primary-600 animate-bounce" style={{ animationDelay: '0s' }} />
            <Pill className="w-20 h-20 text-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Pill className="w-16 h-16 text-primary-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-secondary-900 mb-4">
            Pourquoi SupTracker ?
          </h2>
          <p className="text-center text-secondary-600 mb-12 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour optimiser votre supplémentation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Calendar className="w-12 h-12" />}
              title="Suivi intelligent"
              description="Ne ratez plus jamais une prise. Rappels personnalisés selon vos besoins et votre emploi du temps."
            />

            <FeatureCard
              icon={<Shield className="w-12 h-12" />}
              title="Détection d'interactions"
              description="Évitez les combinaisons dangereuses. Notre système vous alerte en cas d'interactions potentielles."
            />

            <FeatureCard
              icon={<TrendingUp className="w-12 h-12" />}
              title="Suivez vos progrès"
              description="Mesurez l'impact sur votre énergie, humeur et bien-être avec nos statistiques détaillées."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-secondary-900 mb-12">
            Choisissez votre plan
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              plan="Gratuit"
              price="0€"
              features={[
                'Jusqu\'à 5 compléments',
                'Suivi de base',
                'Rappels simples',
                'Accès à la base de données'
              ]}
            />

            <PricingCard
              plan="Premium"
              price="7,99€/mois"
              featured={true}
              features={[
                'Compléments illimités',
                'Détection d\'interactions',
                'Recommandations IA',
                'Analyses avancées',
                'Gestion des stocks',
                'Support prioritaire'
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à optimiser votre santé ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être
          </p>
          <Link to="/signup" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors">
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-300 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 SupTracker. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card text-center hover:shadow-md transition-shadow">
      <div className="inline-block p-4 bg-primary-100 rounded-full text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-3">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  )
}

function PricingCard({ plan, price, features, featured = false }) {
  return (
    <div className={`card ${featured ? 'border-2 border-primary-600 shadow-lg scale-105' : ''}`}>
      {featured && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-accent-500" />
          <span className="text-sm font-semibold text-accent-600 uppercase">Populaire</span>
        </div>
      )}

      <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-primary-600">{price}</span>
        {price !== '0€' && <span className="text-secondary-600">/mois</span>}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <span className="text-secondary-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/signup"
        className={featured ? 'btn-primary w-full' : 'btn-outline w-full'}
      >
        Commencer
      </Link>
    </div>
  )
}

export default Landing
