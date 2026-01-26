import { db } from "../dbconnect.js"; // Assuming this is your MySQL connection file
import jwt from "jsonwebtoken";

// Controller to insert a new class

export const createStaff = async (req, res) => {
  const { name, username, password, grievance_type_id } = req.body;

  // Validate the input
  if (!name || !username || !password || !grievance_type_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Insert staff data into the database
    const [result] = await db.query(
      `INSERT INTO staff (name, username, password, grievance_type_id) 
         VALUES (?, ?, ?, ?)`,
      [name, username, password, grievance_type_id]
    );

    // Return a success response
    res.status(201).json({
      message: "Staff created successfully",
      staffId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating staff:", error.message);

    // Handle unique constraint violation for username
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Username already exists. Please choose another one.",
      });
    }

    // General error response
    res.status(500).json({ error: "Failed to create staff" });
  }
};

//Login for staff
export const staffLogin = async (req, res) => {
  //console.log("@ staff login");
  try {
    const { username, password } = req.body;
    //console.log(username);

    // Fetch user details by username
    const [user] = await db.execute("SELECT * FROM staff WHERE username = ?", [
      username,
    ]);
    console.log(user[0].password);
    if (!user || user.length === 0) {
      return res.status(400).json({ message: "Invalid username" });
    }

    // Compare the entered password directly with the stored plain-text password
    if (user[0].password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        uid: user[0].id,
        userId: user[0].user_id,
        role: "satff",
        grievance_type_id: user[0].grievance_type_id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Respond with token and role
    res.status(200).json({
      message: "Login successful",
      token,
      role: user[0].role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Fetch related Grives
export const fetchGrievances = async (req, res) => {
  try {
    // Extract staffId from the request body
    const staffId = req.body.staffId;

    // Validate staffId
    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }

    // Step 1: Query the staff table for the grievance_type_id assigned to the staff
    const [staffResult] = await db.execute(
      "SELECT grievance_type_id FROM staff WHERE id = ?",
      [staffId]
    );

    if (staffResult.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const grievanceTypeId = staffResult[0].grievance_type_id;

    // Step 2: Query the grievances table for grievances with the matching grievance_type_id
    const [grievancesResult] = await db.execute(
      "SELECT id,title,priority,status,created_at FROM grievances WHERE grievance_type_id = ?",
      [grievanceTypeId]
    );

    // Step 3: Return the matched grievances
    res.status(200).json({
      message: "Grievances fetched successfully",
      grievances: grievancesResult,
    });
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({ message: "Error fetching grievances", error });
  }
};
