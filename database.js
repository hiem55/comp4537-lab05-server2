const pg = require('pg');

const Pool = pg.Pool;

// Create a pool instance for PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const query = async (text) => {
  try {
    const res = await pool.query(text);
    return res;
  } catch (err) {
    console.log(err.stack);
  }
}

// Connect to the PostgreSQL database
pool.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected to PostgreSQL successfully');
  }
});

module.exports = { pool, query };


