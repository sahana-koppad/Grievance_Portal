// controllers/authController.js
import jwt from "jsonwebtoken";
import { db } from "../dbconnect.js"; // Import DB connection

// Function to handle login
export const loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const [user] = await db.execute(
      "SELECT * FROM students WHERE username = ?",
      [username]
    );

    if (!user || user.length === 0) {
      return res.status(400).json({ message: "Invalid username" });
    }

    // Check if the entered password matches the plain-text password in the database
    if (user[0].password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const role = "student";

    // Generate JWT token
    const token = jwt.sign(
      { userId: user[0].id, role, username: user[0].username }, // Use id as userId
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send the response with the correct user data
    res.status(200).json({
      message: "Login successful",
      token,
      role,
      userId: user[0].id, // Ensure you're using user[0].id explicitly
      username: user[0].username,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
};
