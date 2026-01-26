import { db } from "../dbconnect.js";

export const newGrivType = async (req, res) => {
  const { name } = req.body;

  // Check if the name field is empty
  if (!name) {
    return res.status(400).json({ error: "Grievance type name is required" });
  }

  const query = "INSERT INTO grievance_types (name) VALUES (?)";
  try {
    // Use `db.promise()` for cleaner async/await handling
    const [result] = await db.query(query, [name]);

    // Send response after successful insert
    res.status(201).json({
      message: "Grievance type created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error inserting grievance type:", err);
    res.status(500).json({ error: "Failed to create grievance type" });
  }
};

export const fetchgrivtypes = async (req, res) => {
  const query = "SELECT id, name FROM grievance_types"; // Select only required columns

  try {
    const [rows] = await db.query(query);

    // Send the result wrapped in a key (e.g., "result")
    res.json({ result: rows });
  } catch (error) {
    console.error("Error fetching grievance types:", error.message);
    res.status(500).json({ error: "Failed to fetch grievance types" });
  }
};
