import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const result = await query(
      'SELECT id, email, name, subscription_tier FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' })
    }

    req.user = result.rows[0]
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Token invalide' })
  }
}

export const checkSupplementLimit = async (req, res, next) => {
  try {
    if (req.user.subscription_tier === 'free') {
      const result = await query(
        'SELECT COUNT(*) as count FROM user_supplements WHERE user_id = $1 AND is_active = true',
        [req.user.id]
      )

      const count = parseInt(result.rows[0].count)

      if (count >= 5) {
        return res.status(403).json({
          error: 'Limite atteinte',
          message: 'Les utilisateurs gratuits peuvent ajouter jusqu\'à 5 compléments. Passez Premium pour des compléments illimités.'
        })
      }
    }
    next()
  } catch (error) {
    console.error('Supplement limit check error:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
