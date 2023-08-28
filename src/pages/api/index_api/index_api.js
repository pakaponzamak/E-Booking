import pool from '../../../server/mySQL'


// Define a function to execute MySQL queries
async function executeQuery(query, values) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query, values);
      return rows;
    } finally {
      connection.release();
    }
  }

    // Define a function to insert a new user into the MySQL database
async function postUser(user_id	,name) {
    const query =
  'INSERT INTO users (user_id,name) VALUES (?, ?)';
    const values = [user_id	,name];
    try {
      await executeQuery(query, values);
    } catch (error) {
      throw error; // Rethrow the error to handle it in the caller
    }
  }
    // Now you can use executeQuery to run MySQL queries
const getUsers = async () => {
    const query = 'SELECT * FROM users';
    const health = await executeQuery(query);
    return health;
  };

export default async function health(req,res)
{
    if (req.method === 'GET') {
        // Handle GET request, e.g., fetch data from MySQL
        const users = await getUsers();
        res.status(200).json(users);
      }
   else if (req.method === 'POST') {
        // Handle POST request, e.g., insert data into MySQL
        const { user_id	,name } = req.body;
      
        try {
          await postUser(user_id,name);
          res.status(200).json({ message: 'Data inserted successfully' });
        } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
}