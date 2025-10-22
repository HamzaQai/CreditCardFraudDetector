import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { query } from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Signup
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Données invalides', errors: errors.array() })
      }

      const { email, password, name } = req.body

      // Check if user exists
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const result = await query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, subscription_tier',
        [email, hashedPassword, name]
      )

      const user = result.rows[0]

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, subscription_tier: user.subscription_tier },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({ token, user })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({ error: 'Erreur lors de l\'inscription' })
    }
  }
)

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Données invalides' })
      }

      const { email, password } = req.body

      // Find user
      const result = await query(
        'SELECT id, email, name, password, subscription_tier FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      }

      const user = result.rows[0]

      // Verify password
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, subscription_tier: user.subscription_tier },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Remove password from response
      delete user.password

      res.json({ token, user })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Erreur lors de la connexion' })
    }
  }
)

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, subscription_tier, created_at FROM users WHERE id = $1',
      [req.user.id]
    )

    res.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
