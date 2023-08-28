import pool from "../../../server/mySQL";

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
const getCourses = async () => {
  const query = "SELECT * FROM training_course";
  const courses = await executeQuery(query);
  return courses;
};

  // Define a function to insert a new user into the MySQL database
  async function postCourse(
    user_id,
    name,
    time_selected,
    course,
    plant,
    date,
    hall) {
    const query =
  'INSERT INTO training_course (user_id,name,time_selected,course,plant,date,hall) VALUES (?,?,?,?,?,?,?)';
    const values = [user_id,name,time_selected,course,plant,date,hall];
    try {
      await executeQuery(query, values);
    } catch (error) {
      throw error; // Rethrow the error to handle it in the caller
    }
  }

export default async function course(req, res) {
  if (req.method === "GET") {
    // Handle GET request, e.g., fetch data from MySQL
    const courses = await getCourses();
    res.status(200).json(courses);
  } else if (req.method === "POST") {
    // Handle POST request, e.g., insert data into MySQL
    const {
        user_id,
        name,
        time_selected,
        course,
        plant,
        date,
        hall
    } = req.body;

    try {
      await postCourse(
        user_id,
        name,
        time_selected,
        course,
        plant,
        date,
        hall
      );
      res.status(200).json({ message: "Data inserted successfully" });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
