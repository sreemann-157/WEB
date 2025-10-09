const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Student Schema
const studentSchema = new mongoose.Schema({
  registerNo: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  deptName: { type: String, required: true },
  marks: { type: Number, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// Routes
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/student", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json({ message: "Student added successfully!" });
});

app.put("/student/:registerNo", async (req, res) => {
  const student = await Student.findOneAndUpdate(
    { registerNo: req.params.registerNo },
    req.body,
    { new: true }
  );
  res.json({ message: "Student updated successfully!" });
});

app.delete("/student/:registerNo", async (req, res) => {
  await Student.findOneAndDelete({ registerNo: req.params.registerNo });
  res.json({ message: "Student deleted successfully!" });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
