import express from 'express'
import { query } from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get all supplements with optional filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category, benefit } = req.query

    let queryText = `
      SELECT s.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', al.id,
              'store_name', al.store_name,
              'url', al.url,
              'price', al.price,
              'currency', al.currency,
              'is_recommended', al.is_recommended
            )
          ) FILTER (WHERE al.id IS NOT NULL), '[]'
        ) as affiliate_links
      FROM supplements s
      LEFT JOIN affiliate_links al ON s.id = al.supplement_id
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (search) {
      queryText += ` AND (s.name ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    if (category) {
      queryText += ` AND s.category = $${paramCount}`
      params.push(category)
      paramCount++
    }

    if (benefit) {
      queryText += ` AND $${paramCount} = ANY(s.benefits)`
      params.push(benefit)
      paramCount++
    }

    queryText += ' GROUP BY s.id ORDER BY s.name'

    const result = await query(queryText, params)

    res.json({ supplements: result.rows, total: result.rows.length })
  } catch (error) {
    console.error('Get supplements error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get single supplement by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      `
      SELECT s.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', al.id,
              'store_name', al.store_name,
              'url', al.url,
              'price', al.price,
              'currency', al.currency,
              'is_recommended', al.is_recommended
            )
          ) FILTER (WHERE al.id IS NOT NULL), '[]'
        ) as affiliate_links
      FROM supplements s
      LEFT JOIN affiliate_links al ON s.id = al.supplement_id
      WHERE s.id = $1
      GROUP BY s.id
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Complément non trouvé' })
    }

    res.json({ supplement: result.rows[0] })
  } catch (error) {
    console.error('Get supplement error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
