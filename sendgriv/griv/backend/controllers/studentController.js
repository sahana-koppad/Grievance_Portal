import { db } from "../dbconnect.js";

// Add a new student
export const addStudent = async (req, res) => {
  // console.log("@ addStudent");
  try {
    const { username, password, name, class_id, email, mobile, address } =
      req.body;

    // Insert student into the database
    const [result] = await db.execute(
      "INSERT INTO students (username, password, name, class_id, email, mobile, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, password, name, class_id, email, mobile, address]
    );

    res.status(201).json({
      message: "Student added successfully",
      studentId: result.insertId,
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding student", error: error.message });
  }
};

// Fetch all students
export const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.execute(
      "SELECT s.*, c.name AS class_name FROM students s JOIN classes c ON s.class_id = c.id"
    );
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

// Fetch student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [student] = await db.execute(
      "SELECT s.*, c.name AS class_name FROM students s JOIN classes c ON s.class_id = c.id WHERE s.id = ?",
      [id]
    );

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching student", error: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, name, class_id, email, mobile, address } =
      req.body;

    await db.execute(
      "UPDATE students SET username = ?, password = ?, name = ?, class_id = ?, email = ?, mobile = ?, address = ? WHERE id = ?",
      [username, password, name, class_id, email, mobile, address, id]
    );

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM students WHERE id = ?", [id]);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
};
