import { db } from "../dbconnect.js"; // Assuming this is your MySQL connection file

// Controller to insert a new class
export const createClass = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "Name and description are required." });
  }

  try {
    const query = "INSERT INTO classes (name, description) VALUES (?, ?)";
    const [result] = await db.execute(query, [name, description]);
    res.status(201).json({
      message: "Class created successfully",
      classId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Class name must be unique." });
    } else {
      res.status(500).json({ error: "Failed to create class" });
    }
  }
};

//Featch all classes
export const featchClasses = async (req, res) => {
  try {
    const [result] = await db.query("select id,name from classes");
    res.json({ result: result }); // Send the result as a response
  } catch (error) {
    console.error("Error fetching grievance types:", error.message);
    res.status(500).json({ error: "Failed to fetch grievance types" });
  }
};
