const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sivuyilemtwetwe:gFZQYA4XfZYjFwws@cluster0.ig7vu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB...", err));
  

// Define a Student model
const Student = mongoose.model('Student', new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true },
    performance: { type: Array, default: [] },  // Stores subject performance as [{ subject: 'Math', score: 95 }, ...]
}));

// CRUD routes
// Get all students
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Add a new student
app.post('/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
});

// Update a student
app.put('/students/:id', async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
});


app.delete('/students', async (req, res) => {
    try {
        await Student.deleteMany({});
        res.json({ message: 'All students deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete students', error: err });
    }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
