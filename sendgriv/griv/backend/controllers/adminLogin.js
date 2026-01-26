import jwt from "jsonwebtoken";
import { db } from "../dbconnect.js";

export const adminLogin = async (req, res) => {
  //console.log("@ admin login");
  try {
    const { username, password } = req.body;
    //console.log(username);

    // Fetch user details by username
    const [user] = await db.execute("SELECT * FROM login WHERE username = ?", [
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
      { userId: user[0].user_id, role: user[0].role },
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
