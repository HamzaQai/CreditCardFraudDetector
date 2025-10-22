import express from 'express'
import { query } from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get today's schedule
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id

    // Get all active supplements with their intake status for today
    const result = await query(
      `
      SELECT
        us.id as user_supplement_id,
        s.name,
        us.custom_dosage as dosage,
        us.time_of_day,
        CASE
          WHEN il.id IS NOT NULL THEN true
          ELSE false
        END as taken
      FROM user_supplements us
      JOIN supplements s ON us.supplement_id = s.id
      LEFT JOIN (
        SELECT DISTINCT ON (user_supplement_id) *
        FROM intake_logs
        WHERE DATE(taken_at) = CURRENT_DATE
        ORDER BY user_supplement_id, taken_at DESC
      ) il ON us.id = il.user_supplement_id
      WHERE us.user_id = $1 AND us.is_active = true AND us.frequency = 'daily'
      ORDER BY
        CASE us.time_of_day
          WHEN 'morning' THEN 1
          WHEN 'afternoon' THEN 2
          WHEN 'evening' THEN 3
          ELSE 4
        END
      `,
      [userId]
    )

    // Organize by time of day
    const schedule = {
      morning: [],
      afternoon: [],
      evening: [],
      anytime: []
    }

    result.rows.forEach(supp => {
      const timeCategory = supp.time_of_day === 'morning' ? 'morning' :
                          supp.time_of_day === 'afternoon' ? 'afternoon' :
                          supp.time_of_day === 'evening' ? 'evening' : 'anytime'
      schedule[timeCategory].push(supp)
    })

    // Calculate stats
    const totalToday = result.rows.length
    const takenToday = result.rows.filter(s => s.taken).length

    // Calculate streak (simplified - can be enhanced)
    const streakResult = await query(
      `
      SELECT COUNT(DISTINCT DATE(taken_at)) as streak_days
      FROM intake_logs il
      JOIN user_supplements us ON il.user_supplement_id = us.id
      WHERE us.user_id = $1
        AND taken_at >= CURRENT_DATE - INTERVAL '30 days'
      `,
      [userId]
    )

    const currentStreak = streakResult.rows[0]?.streak_days || 0

    // Calculate week adherence
    const weekResult = await query(
      `
      SELECT
        COUNT(DISTINCT il.id)::float / NULLIF(COUNT(DISTINCT us.id) * 7, 0) * 100 as adherence
      FROM user_supplements us
      LEFT JOIN intake_logs il ON us.id = il.user_supplement_id
        AND il.taken_at >= CURRENT_DATE - INTERVAL '7 days'
      WHERE us.user_id = $1 AND us.is_active = true AND us.frequency = 'daily'
      `,
      [userId]
    )

    const adherenceWeek = Math.round(weekResult.rows[0]?.adherence || 0)

    res.json({
      schedule,
      stats: {
        taken_today: takenToday,
        total_today: totalToday,
        adherence_week: adherenceWeek,
        current_streak: currentStreak
      }
    })
  } catch (error) {
    console.error('Get today schedule error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Get stats for charts
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { period = 'week' } = req.query
    const userId = req.user.id

    const days = period === 'week' ? 7 : 30

    // Get adherence data for each day
    const result = await query(
      `
      WITH daily_expected AS (
        SELECT
          generate_series(
            CURRENT_DATE - INTERVAL '${days - 1} days',
            CURRENT_DATE,
            '1 day'::interval
          )::date as day,
          COUNT(us.id) as expected
        FROM user_supplements us
        WHERE us.user_id = $1 AND us.is_active = true AND us.frequency = 'daily'
        GROUP BY day
      ),
      daily_taken AS (
        SELECT
          DATE(il.taken_at) as day,
          COUNT(DISTINCT il.user_supplement_id) as taken
        FROM intake_logs il
        JOIN user_supplements us ON il.user_supplement_id = us.id
        WHERE us.user_id = $1
          AND il.taken_at >= CURRENT_DATE - INTERVAL '${days - 1} days'
        GROUP BY DATE(il.taken_at)
      )
      SELECT
        de.day,
        COALESCE(dt.taken, 0) as taken,
        de.expected,
        CASE
          WHEN de.expected > 0 THEN ROUND((COALESCE(dt.taken, 0)::float / de.expected * 100))
          ELSE 0
        END as adherence_percentage
      FROM daily_expected de
      LEFT JOIN daily_taken dt ON de.day = dt.day
      ORDER BY de.day
      `,
      [userId]
    )

    const adherenceData = result.rows.map(row => row.adherence_percentage)

    // Get total supplements count
    const supplementsCount = await query(
      'SELECT COUNT(*) as count FROM user_supplements WHERE user_id = $1 AND is_active = true',
      [userId]
    )

    res.json({
      adherence_data: adherenceData,
      total_supplements: parseInt(supplementsCount.rows[0].count),
      premium: req.user.subscription_tier === 'premium'
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
