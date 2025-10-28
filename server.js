const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (Array-based)
let subjects = [
  {
    id: 1,
    subjectCode: 'CS101',
    subjectName: 'Data Structures',
    credits: 4,
    faculty: 'Dr. Smith',
    semester: 'Fall 2024'
  },
  {
    id: 2,
    subjectCode: 'CS102',
    subjectName: 'Algorithms',
    credits: 3,
    faculty: 'Dr. Johnson',
    semester: 'Spring 2024'
  }
];

let nextId = 3;

// Routes

// GET all subjects
app.get('/api/subjects', (req, res) => {
  res.json(subjects);
});

// GET single subject by ID
app.get('/api/subjects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const subject = subjects.find(s => s.id === id);
  
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }
  
  res.json(subject);
});

// POST create new subject
app.post('/api/subjects', (req, res) => {
  const { subjectCode, subjectName, credits, faculty, semester } = req.body;
  
  // Validation
  if (!subjectCode || !subjectName || !credits || !faculty || !semester) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  const newSubject = {
    id: nextId++,
    subjectCode,
    subjectName,
    credits: parseInt(credits),
    faculty,
    semester
  };
  
  subjects.push(newSubject);
  res.status(201).json(newSubject);
});

// PUT update subject
app.put('/api/subjects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { subjectCode, subjectName, credits, faculty, semester } = req.body;
  
  const index = subjects.findIndex(s => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Subject not found' });
  }
  
  subjects[index] = {
    id,
    subjectCode,
    subjectName,
    credits: parseInt(credits),
    faculty,
    semester
  };
  
  res.json(subjects[index]);
});

// DELETE subject
app.delete('/api/subjects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = subjects.findIndex(s => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Subject not found' });
  }
  
  subjects.splice(index, 1);
  res.json({ message: 'Subject deleted successfully' });
});

// Search subjects
app.get('/api/subjects/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  
  const results = subjects.filter(s => 
    s.subjectCode.toLowerCase().includes(query) ||
    s.subjectName.toLowerCase().includes(query) ||
    s.faculty.toLowerCase().includes(query)
  );
  
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});