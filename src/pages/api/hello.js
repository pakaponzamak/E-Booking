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
  } else {
    // Respond with an error message for other HTTP methods
    res.status(405).json({ error: 'Analda Not Allowed' });
  }
}
