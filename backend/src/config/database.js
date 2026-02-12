// Database configuration placeholder.
// Current implementation uses in-memory stores only, but this file
// defines the shape of future DB configuration so it matches README.

export const databaseConfig = {
  type: process.env.DB_TYPE || 'memory', // memory | redis | postgres | mongodb
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  name: process.env.DB_NAME || 'trymint',
  user: process.env.DB_USER || 'trymint_user',
  password: process.env.DB_PASSWORD || '',
  // Connection string (takes precedence over individual settings)
  url: process.env.DATABASE_URL || null
};

