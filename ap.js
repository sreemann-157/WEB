const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors()); 

mongoose.connect("mongodb://localhost:27017/studentdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));
const studentSchema = new mongoose.Schema({
  registerNo: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  department: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/student/:registerno", async (req, res) => {
  const regNo = parseInt(req.params.registerno);
  try {
    const student = await Student.findOne({ registerNo: regNo });
    if (student) res.json(student);
    else res.status(404).json({ error: "Student not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/student", async (req, res) => {
  const { registerNo, name, age, department } = req.body;
  try {
    const exists = await Student.findOne({ registerNo });
    if (exists) return res.status(400).json({ error: "Register number already exists" });

    const newStudent = new Student({ registerNo, name, age, department });
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/student/:registerno", async (req, res) => {
  const regNo = parseInt(req.params.registerno);
  const { name, age, department } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { registerNo: regNo },
      { name, age, department },
      { new: true }
    );
    if (student) res.json({ message: "Student updated successfully" });
    else res.status(404).json({ error: "Student not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/student/:registerno", async (req, res) => {
  const regNo = parseInt(req.params.registerno);
  try {
    const student = await Student.findOneAndDelete({ registerNo: regNo });
    if (student) res.json({ message: "Student deleted successfully" });
    else res.status(404).json({ error: "Student not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
