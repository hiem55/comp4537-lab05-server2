const { Pool } = require('pg');

// Create a pool instance for PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Connect to the PostgreSQL database
pool.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected to PostgreSQL successfully');
  }
});

module.exports = { pool };


