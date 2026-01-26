import { db } from "../dbconnect.js"; // Import DB connection
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/grievances/"); // Folder where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
  },
});

// Configure multer for file upload
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Create grievance
export const createGrievance = async (req, res) => {
  // console.log("I m @ createGrievance");
  console.log(req.body);
  console.log(req.file);

  try {
    const { student_id, title, description, priority, grievance_type_id } =
      req.body;
    const image = req.file ? `uploads/grievances/${req.file.filename}` : null; // Save image path

    // Insert grievance into the database
    const [result] = await db.execute(
      `INSERT INTO grievances (student_id, title, description, image, priority,grievance_type_id) 
       VALUES (?, ?, ?, ?, ?,?)`,
      [student_id, title, description, image, priority, grievance_type_id]
    );

    res.status(201).json({
      message: "Grievance created successfully",
      grievanceId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create grievance" });
  }
};

// Get all grievances
export const getAllGrievances = async (req, res) => {
  try {
    const [grievances] = await db.execute(
      `SELECT g.*, s.name AS student_name, s.email 
       FROM grievances g 
       JOIN students s ON g.student_id = s.id`
    );

    res.status(200).json(grievances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

// Get grievance by ID
export const getGrievancesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch all grievances for a particular student
    const [grievances] = await db.execute(
      `SELECT g.*, s.name AS student_name, s.email 
       FROM grievances g 
       JOIN students s ON g.student_id = s.id 
       WHERE g.student_id = ?`,
      [studentId]
    );

    // Check if no grievances were found
    if (grievances.length === 0) {
      return res
        .status(404)
        .json({ message: "No grievances found for this student" });
    }

    // Return all grievances for the student
    res.status(200).json({ grievances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

//get grievence according to types

// Fetch grievances based on type and priority
export const getGrievancesByTypeAndPriority = async (req, res) => {
  try {
    const { type, priority } = req.query;

    let query = "SELECT * FROM grievances WHERE grievance_type_id = ?";
    let params = [type]; // Assuming 'type' is actually the `grievance_type_id`

    // Add priority filter if provided
    if (priority) {
      query += " AND priority = ?";
      params.push(priority);
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No grievances found for the given criteria." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGrievanceDetailsById = async (req, res) => {
  //console.log("i m here @ getGrievanceDetailsById");
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM grievances WHERE id = ?", [
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Grievance not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch grievance details" });
  }
};

export const updateGrievanceStatus = async (req, res) => {
  const { id } = req.params; // Grievance ID
  const { status, resolved_by } = req.body;
  console.log(id);
  console.log(status);
  console.log(resolved_by);

  try {
    // Declare staffid variable
    let staffid;

    // Fetch staff id from username
    const [staffrow] = await db.query(
      "SELECT id FROM staff WHERE username = ?",
      [resolved_by]
    );

    if (staffrow.length > 0) {
      staffid = staffrow[0].id; // Assign the staff ID
      console.log(staffid);
    } else {
      return res.status(404).json({ message: "Staff not found for the given username" });
    }

    // Fetch grievance details along with the student's email
    const [grievance] = await db.execute(
      `SELECT g.*, s.email, s.name 
       FROM grievances g 
       JOIN students s ON g.student_id = s.id 
       WHERE g.id = ?`,
      [id]
    );

    if (!grievance.length) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const studentEmail = grievance[0].email;
    const studentName = grievance[0].name;

    // Update grievance status and resolved details
    await db.execute(
      `UPDATE grievances 
       SET status = ?, resolved_at = NOW(), resolved_by = ? 
       WHERE id = ?`,
      [status, staffid, id]
    );

    // Send email to the student
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service
      auth: {
        user: "vijaybmath@gmail.com", // Replace with your email
        pass: "gteu snqh tsym ktlo", // Replace with your email password
      },
    });

    const mailOptions = {
      from: "vijaybmath@gmail.com",
      to: studentEmail,
      subject: "Grievance Resolved",
      text: `Dear ${studentName},\n\nYour grievance titled "${grievance[0].title}" has been resolved by ${resolved_by}.\n\nThank you.\nAdmin Team`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Grievance status updated and email sent to student." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating grievance status." });
  }
};


export const grievanceForChart = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, status FROM grievances");

    if (rows.length > 0) {
      return res.status(200).json(rows); // Send all grievances
    } else {
      return res.status(404).json({ message: "No grievances found" });
    }
  } catch (error) {
    console.error("Error fetching grievances:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Create Feedback

// Arrow function to insert feedback
export const createGrievanceFeedback = async (req, res) => {
  try {
    // Extract data from request body
    const { grievance_id, student_id, rating, comments } = req.body;

    // Validate the input
    if (!grievance_id || !student_id || !rating) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Insert feedback into the database
    const query = `
      INSERT INTO feedback (grievance_id, student_id, rating, comments)
      VALUES (?, ?, ?, ?)
    `;
    const values = [grievance_id, student_id, rating, comments || null];

    const [result] = await db.execute(query, values);

    // Send success response
    return res.status(201).json({
      message: "Feedback submitted successfully.",
      feedbackId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting feedback:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while submitting feedback." });
  }
};

//Fetch feedback
export const fetchGrievanceFeedback = async (req, res) => {
  try {
    const query = `
            SELECT 
                students.name AS student_name,
                grievances.title AS grievance_title,
                feedback.rating AS feedback_rating
            FROM 
                students
            INNER JOIN 
                grievances ON students.id = grievances.student_id
            INNER JOIN 
                feedback ON grievances.id = feedback.grievance_id;
        `;

    // Execute the query using async/await
    const [results] = await db.query(query);

    // Send the results as a JSON response
    res.status(200).json(results); // Assuming db.query returns an array with results in the first element
  } catch (error) {
    console.error("Error fetching grievance feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
