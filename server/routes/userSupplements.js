import express from 'express'
import { body, validationResult } from 'express-validator'
import { query } from '../config/db.js'
import { authMiddleware, checkSupplementLimit } from '../middleware/auth.js'

const router = express.Router()

// Get all user supplements
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        us.*,
        s.name as supplement_name,
        s.category,
        s.description,
        s.benefits,
        (
          SELECT taken_at
          FROM intake_logs il
          WHERE il.user_supplement_id = us.id
          ORDER BY taken_at DESC
          LIMIT 1
        ) as last_taken
      FROM user_supplements us
      JOIN supplements s ON us.supplement_id = s.id
      WHERE us.user_id = $1 AND us.is_active = true
      ORDER BY us.created_at DESC
      `,
      [req.user.id]
    )

    res.json({ supplements: result.rows })
  } catch (error) {
    console.error('Get user supplements error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Add supplement to user's stack
router.post('/',
  authMiddleware,
  checkSupplementLimit,
  [
    body('supplement_id').isInt(),
    body('custom_dosage').trim().notEmpty(),
    body('frequency').isIn(['daily', 'weekly', 'as_needed']),
    body('time_of_day').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Données invalides', errors: errors.array() })
      }

      const { supplement_id, custom_dosage, frequency, time_of_day, days_of_week, notes } = req.body

      // Check if supplement exists
      const supplementCheck = await query('SELECT id FROM supplements WHERE id = $1', [supplement_id])
      if (supplementCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Complément non trouvé' })
      }

      // Check if user already has this supplement
      const existingCheck = await query(
        'SELECT id FROM user_supplements WHERE user_id = $1 AND supplement_id = $2',
        [req.user.id, supplement_id]
      )

      if (existingCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Ce complément est déjà dans votre stack' })
      }

      const result = await query(
        `
        INSERT INTO user_supplements (user_id, supplement_id, custom_dosage, frequency, time_of_day, days_of_week, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [req.user.id, supplement_id, custom_dosage, frequency, time_of_day, days_of_week || null, notes || null]
      )

      res.status(201).json({ userSupplement: result.rows[0] })
    } catch (error) {
      console.error('Add user supplement error:', error)
      res.status(500).json({ error: 'Erreur serveur' })
    }
  }
)

// Update user supplement
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { custom_dosage, frequency, time_of_day, days_of_week, notes, is_active } = req.body

    // Verify ownership
    const ownerCheck = await query(
      'SELECT id FROM user_supplements WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Complément non trouvé' })
    }

    const updates = []
    const params = [id, req.user.id]
    let paramCount = 3

    if (custom_dosage !== undefined) {
      updates.push(`custom_dosage = $${paramCount}`)
      params.push(custom_dosage)
      paramCount++
    }
    if (frequency !== undefined) {
      updates.push(`frequency = $${paramCount}`)
      params.push(frequency)
      paramCount++
    }
    if (time_of_day !== undefined) {
      updates.push(`time_of_day = $${paramCount}`)
      params.push(time_of_day)
      paramCount++
    }
    if (days_of_week !== undefined) {
      updates.push(`days_of_week = $${paramCount}`)
      params.push(days_of_week)
      paramCount++
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`)
      params.push(notes)
      paramCount++
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`)
      params.push(is_active)
      paramCount++
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' })
    }

    const result = await query(
      `UPDATE user_supplements SET ${updates.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`,
      params
    )

    res.json({ userSupplement: result.rows[0] })
  } catch (error) {
    console.error('Update user supplement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Delete user supplement
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      'DELETE FROM user_supplements WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Complément non trouvé' })
    }

    res.json({ message: 'Complément supprimé avec succès' })
  } catch (error) {
    console.error('Delete user supplement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Log supplement intake
router.post('/:id/log', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { notes, mood_rating, energy_rating } = req.body

    // Verify ownership
    const ownerCheck = await query(
      'SELECT id FROM user_supplements WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Complément non trouvé' })
    }

    const result = await query(
      'INSERT INTO intake_logs (user_supplement_id, notes, mood_rating, energy_rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, notes || null, mood_rating || null, energy_rating || null]
    )

    res.status(201).json({ log: result.rows[0] })
  } catch (error) {
    console.error('Log intake error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
