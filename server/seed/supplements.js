import dotenv from 'dotenv'
import { query } from '../config/db.js'
import pool from '../config/db.js'

dotenv.config()

const supplements = [
  {
    name: 'Vitamine D3',
    category: 'vitamin',
    description: 'Essentielle pour la santé osseuse, l\'immunité et l\'humeur. La plupart des gens sont carencés, surtout en hiver.',
    recommended_dosage: '2000-4000',
    dosage_unit: 'UI',
    best_time: 'morning',
    benefits: ['Santé osseuse', 'Immunité', 'Humeur', 'Absorption du calcium'],
    warnings: ['À prendre avec des graisses pour meilleure absorption', 'Dosage >10000 UI/jour peut être toxique'],
    interactions: ['Se combine bien avec vitamine K2', 'Améliore absorption du calcium']
  },
  {
    name: 'Magnésium Glycinate',
    category: 'mineral',
    description: 'Forme de magnésium la mieux absorbée. Réduit le stress, améliore le sommeil et détend les muscles.',
    recommended_dosage: '300-400',
    dosage_unit: 'mg',
    best_time: 'evening',
    benefits: ['Sommeil', 'Relaxation musculaire', 'Gestion du stress', 'Santé cardiaque'],
    warnings: ['Peut causer diarrhée à haute dose', 'Éviter si insuffisance rénale'],
    interactions: ['Réduit absorption si pris avec calcium', 'Ne pas prendre avec antibiotiques']
  },
  {
    name: 'Oméga-3 EPA/DHA',
    category: 'omega',
    description: 'Acides gras essentiels pour le cerveau, le cœur et la réduction de l\'inflammation.',
    recommended_dosage: '1000-2000',
    dosage_unit: 'mg',
    best_time: 'with_meal',
    benefits: ['Santé cardiovasculaire', 'Fonction cérébrale', 'Anti-inflammatoire', 'Humeur'],
    warnings: ['Prendre avec repas pour éviter reflux', 'Risque d\'anticoagulation à haute dose'],
    interactions: ['Augmente effet des anticoagulants']
  },
  {
    name: 'Vitamine B12 (Méthylcobalamine)',
    category: 'vitamin',
    description: 'Cruciale pour l\'énergie, la fonction nerveuse et la production de globules rouges. Essentielle pour végétariens/végans.',
    recommended_dosage: '1000',
    dosage_unit: 'mcg',
    best_time: 'morning',
    benefits: ['Énergie', 'Fonction cognitive', 'Santé nerveuse', 'Production de globules rouges'],
    warnings: ['Les personnes de plus de 50 ans absorbent moins bien', 'Forme méthylcobalamine mieux absorbée'],
    interactions: ['Peut être réduite par metformine ou IPP']
  },
  {
    name: 'Zinc',
    category: 'mineral',
    description: 'Minéral essentiel pour l\'immunité, la cicatrisation et la santé de la peau.',
    recommended_dosage: '15-30',
    dosage_unit: 'mg',
    best_time: 'with_meal',
    benefits: ['Immunité', 'Santé de la peau', 'Cicatrisation', 'Production de testostérone'],
    warnings: ['Peut causer nausées si pris à jeun', 'Ne pas dépasser 40mg/jour'],
    interactions: ['Réduit absorption du cuivre', 'Ne pas prendre avec antibiotiques']
  },
  {
    name: 'Vitamine C',
    category: 'vitamin',
    description: 'Antioxydant puissant, soutient le système immunitaire et la production de collagène.',
    recommended_dosage: '500-1000',
    dosage_unit: 'mg',
    best_time: 'morning',
    benefits: ['Immunité', 'Antioxydant', 'Production de collagène', 'Absorption du fer'],
    warnings: ['Doses élevées peuvent causer diarrhée', 'Peut augmenter risque de calculs rénaux'],
    interactions: ['Améliore absorption du fer non-héminique']
  },
  {
    name: 'Créatine Monohydrate',
    category: 'amino_acid',
    description: 'Améliore la force musculaire, la performance sportive et potentiellement la fonction cognitive.',
    recommended_dosage: '3-5',
    dosage_unit: 'g',
    best_time: 'anytime',
    benefits: ['Force musculaire', 'Performance sportive', 'Fonction cognitive', 'Récupération'],
    warnings: ['Boire beaucoup d\'eau', 'Peut causer rétention d\'eau légère'],
    interactions: ['Aucune interaction majeure connue']
  },
  {
    name: 'Ashwagandha',
    category: 'plant',
    description: 'Adaptogène puissant qui réduit le stress et l\'anxiété, améliore le sommeil et équilibre les hormones.',
    recommended_dosage: '300-600',
    dosage_unit: 'mg',
    best_time: 'evening',
    benefits: ['Réduction du stress', 'Sommeil', 'Équilibre hormonal', 'Performance cognitive'],
    warnings: ['Peut causer somnolence', 'Éviter pendant grossesse'],
    interactions: ['Peut augmenter effets des sédatifs']
  },
  {
    name: 'L-Théanine',
    category: 'amino_acid',
    description: 'Acide aminé du thé vert qui favorise la relaxation sans somnolence et améliore la concentration.',
    recommended_dosage: '100-200',
    dosage_unit: 'mg',
    best_time: 'anytime',
    benefits: ['Relaxation', 'Concentration', 'Réduction du stress', 'Qualité du sommeil'],
    warnings: ['Peut réduire la tension artérielle'],
    interactions: ['Synergie avec caféine pour focus']
  },
  {
    name: 'Vitamine K2 (MK-7)',
    category: 'vitamin',
    description: 'Dirige le calcium vers les os et les dents, et loin des artères.',
    recommended_dosage: '100-200',
    dosage_unit: 'mcg',
    best_time: 'with_meal',
    benefits: ['Santé osseuse', 'Santé cardiovasculaire', 'Utilisation du calcium'],
    warnings: ['Interagit avec anticoagulants', 'Prendre avec graisses'],
    interactions: ['Synergie avec vitamine D3', 'Contre-indiqué avec warfarine']
  },
  {
    name: 'Probiotiques Multi-souches',
    category: 'probiotic',
    description: 'Bactéries bénéfiques pour la santé digestive, l\'immunité et potentiellement l\'humeur.',
    recommended_dosage: '10-50',
    dosage_unit: 'milliards CFU',
    best_time: 'morning',
    benefits: ['Santé digestive', 'Immunité', 'Absorption des nutriments', 'Santé mentale'],
    warnings: ['Conserver au frais', 'Peut causer ballonnements initialement'],
    interactions: ['Attendre 2h après antibiotiques']
  },
  {
    name: 'Curcuma (Curcumine)',
    category: 'plant',
    description: 'Anti-inflammatoire naturel puissant avec des propriétés antioxydantes.',
    recommended_dosage: '500-1000',
    dosage_unit: 'mg',
    best_time: 'with_meal',
    benefits: ['Anti-inflammatoire', 'Antioxydant', 'Santé des articulations', 'Fonction cognitive'],
    warnings: ['Prendre avec poivre noir (pipérine) pour absorption', 'Peut augmenter saignement'],
    interactions: ['Augmente effet des anticoagulants']
  },
  {
    name: 'Fer (Bisglycinate)',
    category: 'mineral',
    description: 'Essentiel pour la production d\'hémoglobine et le transport de l\'oxygène. Important pour les femmes.',
    recommended_dosage: '18-27',
    dosage_unit: 'mg',
    best_time: 'morning',
    benefits: ['Énergie', 'Prévention de l\'anémie', 'Transport de l\'oxygène', 'Fonction cognitive'],
    warnings: ['Peut causer constipation', 'Ne pas prendre si non carencé'],
    interactions: ['Absorption réduite par café/thé', 'Améliorée par vitamine C']
  },
  {
    name: 'CoQ10 (Coenzyme Q10)',
    category: 'other',
    description: 'Antioxydant qui soutient la production d\'énergie cellulaire et la santé cardiaque.',
    recommended_dosage: '100-200',
    dosage_unit: 'mg',
    best_time: 'with_meal',
    benefits: ['Énergie cellulaire', 'Santé cardiaque', 'Antioxydant', 'Performance sportive'],
    warnings: ['Forme ubiquinol mieux absorbée', 'Peut réduire effet des anticoagulants'],
    interactions: ['Peut interagir avec statines']
  },
  {
    name: 'Rhodiola Rosea',
    category: 'plant',
    description: 'Adaptogène qui combat la fatigue, améliore les performances mentales et réduit le stress.',
    recommended_dosage: '200-600',
    dosage_unit: 'mg',
    best_time: 'morning',
    benefits: ['Énergie', 'Performance cognitive', 'Réduction du stress', 'Endurance physique'],
    warnings: ['Peut causer insomnie si pris le soir', 'Éviter si bipolaire'],
    interactions: ['Peut interagir avec antidépresseurs']
  },
  {
    name: 'Collagène (Type I & III)',
    category: 'other',
    description: 'Protéine structurelle pour la peau, les cheveux, les ongles et les articulations.',
    recommended_dosage: '10-20',
    dosage_unit: 'g',
    best_time: 'anytime',
    benefits: ['Santé de la peau', 'Articulations', 'Cheveux et ongles', 'Santé intestinale'],
    warnings: ['Prendre avec vitamine C pour meilleure synthèse'],
    interactions: ['Aucune interaction majeure']
  },
  {
    name: 'Glycine',
    category: 'amino_acid',
    description: 'Acide aminé qui améliore le sommeil, soutient la production de collagène et la détoxification.',
    recommended_dosage: '3-5',
    dosage_unit: 'g',
    best_time: 'evening',
    benefits: ['Sommeil', 'Production de collagène', 'Détoxification', 'Santé digestive'],
    warnings: ['Peut causer somnolence'],
    interactions: ['Aucune interaction majeure']
  },
  {
    name: 'NAC (N-Acétyl-Cystéine)',
    category: 'amino_acid',
    description: 'Précurseur du glutathion, puissant antioxydant et soutien de la détoxification hépatique.',
    recommended_dosage: '600-1200',
    dosage_unit: 'mg',
    best_time: 'morning',
    benefits: ['Antioxydant', 'Santé hépatique', 'Santé respiratoire', 'Détoxification'],
    warnings: ['Peut causer nausées', 'Odeur de soufre normale'],
    interactions: ['Peut augmenter effet des bronchodilatateurs']
  },
  {
    name: 'Vitamine E',
    category: 'vitamin',
    description: 'Antioxydant liposoluble qui protège les cellules et soutient la santé de la peau.',
    recommended_dosage: '200-400',
    dosage_unit: 'UI',
    best_time: 'with_meal',
    benefits: ['Antioxydant', 'Santé de la peau', 'Protection cellulaire', 'Santé cardiovasculaire'],
    warnings: ['Forme naturelle (d-alpha) meilleure que synthétique', 'Hautes doses peuvent augmenter saignement'],
    interactions: ['Peut augmenter effet des anticoagulants']
  },
  {
    name: 'Sélénium',
    category: 'mineral',
    description: 'Minéral trace essentiel pour la fonction thyroïdienne et le système antioxydant.',
    recommended_dosage: '100-200',
    dosage_unit: 'mcg',
    best_time: 'anytime',
    benefits: ['Fonction thyroïdienne', 'Antioxydant', 'Immunité', 'Santé reproductive'],
    warnings: ['Ne pas dépasser 400mcg/jour', 'Toxique à haute dose'],
    interactions: ['Peut augmenter effet de la vitamine E']
  },
  {
    name: 'Ginkgo Biloba',
    category: 'plant',
    description: 'Plante qui améliore la circulation sanguine et potentiellement la mémoire.',
    recommended_dosage: '120-240',
    dosage_unit: 'mg',
    best_time: 'morning',
    benefits: ['Circulation sanguine', 'Mémoire', 'Concentration', 'Antioxydant'],
    warnings: ['Peut augmenter saignement', 'Éviter avant chirurgie'],
    interactions: ['Augmente effet des anticoagulants']
  },
  {
    name: 'Iode',
    category: 'mineral',
    description: 'Essentiel pour la fonction thyroïdienne et le métabolisme.',
    recommended_dosage: '150-300',
    dosage_unit: 'mcg',
    best_time: 'morning',
    benefits: ['Fonction thyroïdienne', 'Métabolisme', 'Développement cognitif', 'Énergie'],
    warnings: ['Ne pas prendre si hyperthyroïdie', 'Peut aggraver maladies auto-immunes'],
    interactions: ['Peut interagir avec médicaments thyroïdiens']
  },
  {
    name: 'Calcium',
    category: 'mineral',
    description: 'Minéral essentiel pour la santé osseuse et la fonction musculaire.',
    recommended_dosage: '500-1000',
    dosage_unit: 'mg',
    best_time: 'with_meal',
    benefits: ['Santé osseuse', 'Fonction musculaire', 'Transmission nerveuse', 'Santé dentaire'],
    warnings: ['Ne pas dépasser 2500mg/jour', 'Peut causer constipation'],
    interactions: ['Réduit absorption du fer et du zinc', 'Prendre avec vitamine D et K2']
  },
  {
    name: 'Complexe B (B1, B2, B3, B5, B6, B7, B9, B12)',
    category: 'vitamin',
    description: 'Groupe de vitamines essentielles pour l\'énergie, le métabolisme et la fonction nerveuse.',
    recommended_dosage: '1',
    dosage_unit: 'comprimé',
    best_time: 'morning',
    benefits: ['Énergie', 'Métabolisme', 'Fonction nerveuse', 'Santé de la peau'],
    warnings: ['Peut colorer l\'urine en jaune vif (normal)', 'Prendre le matin (peut être stimulant)'],
    interactions: ['Peut réduire efficacité de certains médicaments']
  },
  {
    name: 'Taurine',
    category: 'amino_acid',
    description: 'Acide aminé qui soutient la santé cardiaque, la performance physique et la fonction cognitive.',
    recommended_dosage: '500-2000',
    dosage_unit: 'mg',
    best_time: 'anytime',
    benefits: ['Santé cardiaque', 'Performance physique', 'Fonction cognitive', 'Antioxydant'],
    warnings: ['Généralement bien toléré'],
    interactions: ['Aucune interaction majeure']
  },
  {
    name: 'Ginseng (Panax)',
    category: 'plant',
    description: 'Adaptogène qui améliore l\'énergie, la fonction cognitive et réduit la fatigue.',
    recommended_dosage: '200-400',
    dosage_unit: 'mg',
    best_time: 'morning',
    benefits: ['Énergie', 'Fonction cognitive', 'Endurance', 'Immunité'],
    warnings: ['Peut causer insomnie si pris le soir', 'Éviter si hypertension'],
    interactions: ['Peut interagir avec anticoagulants et antidiabétiques']
  },
  {
    name: 'Mélatonine',
    category: 'other',
    description: 'Hormone du sommeil qui aide à réguler le cycle veille-sommeil.',
    recommended_dosage: '0.5-5',
    dosage_unit: 'mg',
    best_time: 'evening',
    benefits: ['Sommeil', 'Jet lag', 'Antioxydant', 'Régulation circadienne'],
    warnings: ['Commencer avec faible dose', 'Peut causer somnolence matinale'],
    interactions: ['Peut augmenter effet des sédatifs']
  },
  {
    name: 'BCAA (Acides aminés ramifiés)',
    category: 'amino_acid',
    description: 'Leucine, isoleucine et valine pour la récupération musculaire et la performance sportive.',
    recommended_dosage: '5-10',
    dosage_unit: 'g',
    best_time: 'with_meal',
    benefits: ['Récupération musculaire', 'Performance sportive', 'Réduction fatigue', 'Synthèse protéique'],
    warnings: ['Prendre pendant ou après l\'entraînement'],
    interactions: ['Aucune interaction majeure']
  },
  {
    name: 'Acide Alpha-Lipoïque',
    category: 'other',
    description: 'Antioxydant puissant qui soutient la santé métabolique et la fonction nerveuse.',
    recommended_dosage: '300-600',
    dosage_unit: 'mg',
    best_time: 'empty_stomach',
    benefits: ['Antioxydant', 'Santé métabolique', 'Sensibilité à l\'insuline', 'Santé nerveuse'],
    warnings: ['Peut réduire glycémie', 'Prendre à jeun pour meilleure absorption'],
    interactions: ['Peut augmenter effet des antidiabétiques']
  },
  {
    name: 'Spiruline',
    category: 'plant',
    description: 'Algue riche en protéines, vitamines et minéraux avec propriétés antioxydantes.',
    recommended_dosage: '3-5',
    dosage_unit: 'g',
    best_time: 'morning',
    benefits: ['Protéines complètes', 'Antioxydant', 'Détoxification', 'Immunité'],
    warnings: ['Peut être contaminée si mauvaise qualité', 'Goût fort'],
    interactions: ['Peut augmenter effet des anticoagulants']
  }
]

const affiliateLinks = [
  { supplement_name: 'Vitamine D3', store_name: 'iHerb', price: 12.99 },
  { supplement_name: 'Vitamine D3', store_name: 'Amazon', price: 15.99 },
  { supplement_name: 'Magnésium Glycinate', store_name: 'iHerb', price: 18.50 },
  { supplement_name: 'Oméga-3 EPA/DHA', store_name: 'iHerb', price: 24.99 },
  { supplement_name: 'Oméga-3 EPA/DHA', store_name: 'Nutrimuscle', price: 29.90 },
  { supplement_name: 'Vitamine B12 (Méthylcobalamine)', store_name: 'Amazon', price: 14.99 },
  { supplement_name: 'Zinc', store_name: 'iHerb', price: 9.99 },
  { supplement_name: 'Créatine Monohydrate', store_name: 'MyProtein', price: 19.99 },
  { supplement_name: 'Ashwagandha', store_name: 'iHerb', price: 16.50 },
  { supplement_name: 'Probiotiques Multi-souches', store_name: 'Nutripure', price: 34.90 },
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Insert supplements
    for (const supp of supplements) {
      try {
        await query(
          `
          INSERT INTO supplements (name, category, description, recommended_dosage, dosage_unit, best_time, benefits, warnings, interactions)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING
          `,
          [
            supp.name,
            supp.category,
            supp.description,
            supp.recommended_dosage,
            supp.dosage_unit,
            supp.best_time,
            supp.benefits,
            supp.warnings,
            supp.interactions
          ]
        )
        console.log(`✅ Added: ${supp.name}`)
      } catch (err) {
        console.log(`⚠️  Skipped ${supp.name} (may already exist)`)
      }
    }

    // Insert affiliate links
    for (const link of affiliateLinks) {
      try {
        // Get supplement id
        const suppResult = await query(
          'SELECT id FROM supplements WHERE name = $1',
          [link.supplement_name]
        )

        if (suppResult.rows.length > 0) {
          await query(
            `
            INSERT INTO affiliate_links (supplement_id, store_name, url, price, currency, is_recommended)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING
            `,
            [
              suppResult.rows[0].id,
              link.store_name,
              `https://example.com/link-to-${link.store_name.toLowerCase()}`,
              link.price,
              'EUR',
              link.store_name === 'iHerb'
            ]
          )
          console.log(`🔗 Added affiliate link: ${link.store_name} for ${link.supplement_name}`)
        }
      } catch (err) {
        console.log(`⚠️  Failed to add affiliate link for ${link.supplement_name}`)
      }
    }

    console.log('✅ Database seeding completed!')
    console.log(`📊 Total supplements added: ${supplements.length}`)

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    await pool.end()
    process.exit(1)
  }
}

seedDatabase()
