import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testDatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Define a function to execute a MySQL query
async function executeQuery(query) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } finally {
    connection.release();
  }
}

// Now you can use executeQuery to run MySQL queries
const getUsers = async () => {
  const query = 'SELECT * FROM employee';
  const users = await executeQuery(query);
  return users;
};
// Define a function to insert a new user into the MySQL database
async function postUser(fname,  date) {
  const query = `INSERT INTO employee ( date, name ) VALUES (${date},${fname})`;
  await executeQuery(query);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request, e.g., fetch data from MySQL
    const users = await getUsers();
    res.status(200).json(users);
  }
  else if (req.method === 'POST') {
    // Handle POST request, e.g., insert data into MySQL
    const { date, fname } = req.body;
  
    try {
      await postUser(fname, date);
      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
   else if (req.method === 'PUT') {
    // Handle PUT request, e.g., update data in MySQL
    // ...
    res.status(200).json({ message: 'Data updated successfully' });
  }
   else if (req.method === 'DELETE') {
    // Handle DELETE request, e.g., delete data from MySQL
    // ...
    res.status(200).json({ message: 'Data delete successfully' });
  } 
  else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
