// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// The default function for handling the API request
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Respond with a JSON object for GET request
    res.status(200).json({
      name: "Analda Laocharoensombat",
      gender: "Boy",
      age: "99 Years old",
      location: ""
    });
  } else if (req.method === 'POST') {
    // Handle the incoming POST request data
    const { name, gender, age, location } = req.body;

    res.status(200).json({ 
      name: name || "",
      gender: gender || "",
      age: age || "",
      location: location || ""
    });
  } else if (req.method === 'PUT') {
    // Handle the PUT request
    // Perform necessary operations to update data
    // Respond with a success message or updated data
    res.status(200).json({ message: 'Data updated successfully' });
  } else if (req.method === 'DELETE') {
    // Handle the DELETE request
    // Perform necessary operations to delete data
    // Respond with a success message
    res.status(200).json({ message: 'Data deleted successfully' });
  } else {
    // Respond with an error message for other HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
