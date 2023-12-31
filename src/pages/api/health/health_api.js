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
async function postUser(health_id, user_id, name, doctor_type, phone_num, time_selected, date_selected, plant_selected, checkIn_time, picked_what, chechOrNot, more_detail) {
    const query =
  'INSERT INTO health_care (health_id, user_id, name, doctor_type, phone_num, time_selected, date_selected, plant_selected, checkIn_time, picked_what, chechOrNot, more_detail) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?)';
    const values = [health_id, user_id, name, doctor_type, phone_num, time_selected, date_selected, plant_selected, checkIn_time, picked_what, chechOrNot, more_detail];
    try {
      await executeQuery(query, values);
    } catch (error) {
      throw error; // Rethrow the error to handle it in the caller
    }
  }
    // Now you can use executeQuery to run MySQL queries
const getHealth = async () => {
    const query = 'SELECT * FROM health_care';
    const health = await executeQuery(query);
    return health;
  };

export default async function health(req,res)
{
    if (req.method === 'GET') {
        // Handle GET request, e.g., fetch data from MySQL
        const health = await getHealth();
        res.status(200).json(health);
      }
   else if (req.method === 'POST') {
        // Handle POST request, e.g., insert data into MySQL
        const { health_id, user_id, name, doctor_type, phone_num, time_selected, date_selected, plant_selected, checkIn_time, picked_what, chechOrNot, more_detail } = req.body;
      
        try {
          await postUser(health_id, user_id, name, doctor_type, phone_num, time_selected, date_selected, plant_selected, checkIn_time, picked_what, chechOrNot, more_detail);
          res.status(200).json({ message: 'Data inserted successfully' });
        } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
}