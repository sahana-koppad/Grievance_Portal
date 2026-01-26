// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { loginStudent } from "./controllers/authController.js"; // Import login controller
import { adminLogin } from "./controllers/adminLogin.js";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "./controllers/studentController.js";
import {
  createGrievance,
  getAllGrievances,
  getGrievancesByStudent,
  upload,
  getGrievancesByTypeAndPriority,
  getGrievanceDetailsById,
  updateGrievanceStatus,
  grievanceForChart,
  createGrievanceFeedback,
  fetchGrievanceFeedback,
} from "./controllers/grievanceController.js";

import { newGrivType, fetchgrivtypes } from "./controllers/grievanceType.js";
import { createClass, featchClasses } from "./controllers/createClass.js";
import {
  createStaff,
  staffLogin,
  fetchGrievances,
} from "./controllers/staff.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

// Extract the current directory path from import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const routes = express.Router();
//admin and super admin login
routes.post("/api/adminlogin", adminLogin);

// Login route
routes.post("/api/studentlogin", loginStudent); // Use the loginUser function here

//student related routes
routes.post("/api/addStudent", addStudent); // Add a new student
routes.get("/students", getAllStudents); // Get all students
routes.get("/students/:id", getStudentById); // Get student by ID
routes.put("/students/:id", updateStudent); // Update student
routes.delete("/students/:id", deleteStudent); // Delete student

//Student Create feedback
routes.post("/api/createFeedback", createGrievanceFeedback); // Add a new Feedeback
//Admin fetch feedback
routes.get("/api/fetchFeedback", fetchGrievanceFeedback); // Get all students

//grivience related
routes.post("/api/grievances", upload.single("image"), createGrievance);
routes.get("/", getAllGrievances);
routes.get("/api/getGrievancesByStudent/:studentId", getGrievancesByStudent);

// Define the route directly in the server
app.get("/api/getGrievancesByTypes", getGrievancesByTypeAndPriority);

//Get Detail of the grievance
app.get("/api/getGrievanceDetails/:id", getGrievanceDetailsById);
//Update the status of the grivince
app.put("/api/updateGrievanceStatus/:id", updateGrievanceStatus);

//Get All Grievince for Chart
app.get("/api/grievanceForChart", grievanceForChart);

//To create Grievence type
routes.post("/api/grievance-types", newGrivType);
routes.get("/api/fetchgrievancetypes", fetchgrivtypes);

//To Create Class
routes.post("/api/createClass", createClass);
//To get Classes
routes.get("/api/allClasses", featchClasses);

//To Create staff
routes.post("/api/createStaff", createStaff);

//Staff login
routes.post("/api/stafflogin", staffLogin);

//Staff To get Grivience
routes.post("/api/getgrives", fetchGrievances);

// Use routes
app.use(routes);

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
