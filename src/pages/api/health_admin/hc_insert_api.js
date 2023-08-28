import { async } from '@firebase/util';
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

  // Now you can use executeQuery to run MySQL queries
const getHealth = async () => {
    const query = 'SELECT * FROM insert_health_care';
    const health = await executeQuery(query);
    return health;
  };

    // Define a function to insert a new user into the MySQL database
async function postUser( health_care_name, health_date, time_Start, time_End, plant, doctor_type, who_picked, already_picked) {
    const query =
  'INSERT INTO insert_health_care ( health_care_name, health_date, time_Start, time_End, plant, doctor_type, who_picked, already_picked) VALUES (?, ?,?,?,?,?,?,?)';
    const values = [ health_care_name, health_date, time_Start, time_End, plant, doctor_type, who_picked, already_picked];
    try {
      await executeQuery(query, values);
    } catch (error) {
      throw error; // Rethrow the error to handle it in the caller
    }
  }
export default async function health_care (req,res){

    if (req.method === 'GET') {
        // Handle GET request, e.g., fetch data from MySQL
        const health = await getHealth();
        res.status(200).json(health);
      }
      else if (req.method === 'POST') {
        // Handle POST request, e.g., insert data into MySQL
        const { health_care_name, health_date, time_Start, time_End, plant, doctor_type, who_picked, already_picked} = req.body;
      
        try {
          await postUser( health_care_name, health_date, time_Start, time_End, plant, doctor_type, who_picked, already_picked);
          res.status(200).json({ message: 'Data inserted successfully' });
        } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
}