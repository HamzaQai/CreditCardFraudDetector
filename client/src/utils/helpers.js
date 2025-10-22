import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, 'dd MMM yyyy', { locale: fr })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, 'dd MMM yyyy à HH:mm', { locale: fr })
}

export const getCategoryColor = (category) => {
  const colors = {
    vitamin: 'bg-purple-100 text-purple-700',
    mineral: 'bg-blue-100 text-blue-700',
    amino_acid: 'bg-green-100 text-green-700',
    plant: 'bg-emerald-100 text-emerald-700',
    probiotic: 'bg-pink-100 text-pink-700',
    omega: 'bg-cyan-100 text-cyan-700',
    other: 'bg-gray-100 text-gray-700',
  }
  return colors[category] || colors.other
}

export const getCategoryLabel = (category) => {
  const labels = {
    vitamin: 'Vitamine',
    mineral: 'Minéral',
    amino_acid: 'Acide aminé',
    plant: 'Plante',
    probiotic: 'Probiotique',
    omega: 'Oméga',
    other: 'Autre',
  }
  return labels[category] || category
}

export const getFrequencyLabel = (frequency) => {
  const labels = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    as_needed: 'Si besoin',
  }
  return labels[frequency] || frequency
}

export const getTimeOfDayLabel = (timeOfDay) => {
  const labels = {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
    with_meal: 'Avec repas',
    empty_stomach: 'À jeun',
    anytime: 'N\'importe quand',
  }
  return labels[timeOfDay] || timeOfDay
}
