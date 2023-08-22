import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'e_booking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;