import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})

export const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create supplements table
    await query(`
      CREATE TABLE IF NOT EXISTS supplements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('vitamin', 'mineral', 'amino_acid', 'plant', 'probiotic', 'omega', 'other')),
        description TEXT,
        recommended_dosage VARCHAR(100),
        dosage_unit VARCHAR(20),
        best_time VARCHAR(50) CHECK (best_time IN ('morning', 'afternoon', 'evening', 'with_meal', 'empty_stomach', 'anytime')),
        benefits TEXT[],
        warnings TEXT[],
        interactions TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create user_supplements table
    await query(`
      CREATE TABLE IF NOT EXISTS user_supplements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        supplement_id INTEGER REFERENCES supplements(id) ON DELETE CASCADE,
        custom_dosage VARCHAR(100),
        frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'as_needed')),
        time_of_day VARCHAR(50),
        days_of_week INTEGER[],
        start_date DATE DEFAULT CURRENT_DATE,
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, supplement_id)
      )
    `)

    // Create intake_logs table
    await query(`
      CREATE TABLE IF NOT EXISTS intake_logs (
        id SERIAL PRIMARY KEY,
        user_supplement_id INTEGER REFERENCES user_supplements(id) ON DELETE CASCADE,
        taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
        energy_rating INTEGER CHECK (energy_rating >= 1 AND energy_rating <= 5)
      )
    `)

    // Create affiliate_links table
    await query(`
      CREATE TABLE IF NOT EXISTS affiliate_links (
        id SERIAL PRIMARY KEY,
        supplement_id INTEGER REFERENCES supplements(id) ON DELETE CASCADE,
        store_name VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        price DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'EUR',
        is_recommended BOOLEAN DEFAULT false
      )
    `)

    console.log('✅ Database tables initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

export default pool
