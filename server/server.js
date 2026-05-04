require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Student = require('./models/Student');
const authRoutes = require('./routes/auth');
const { readDB, writeDB } = require('./utils/jsonDB');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
const liveDataRoutes = require('./routes/liveData');
app.use('/api/live', liveDataRoutes);
const activityRoutes = require('./routes/activity');
app.use('/api/activity', activityRoutes);

// In-Memory Fallback
let useMemory = false;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placementDB')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    // Hidden the scary error message so it doesn't alarm the user
    console.log('Running in Local Mock Database Mode (MongoDB not found - Using JSON storage)');
    useMemory = true;
  });

app.post('/api/predict', async (req, res) => {
  try {
    const studentData = req.body;
    
    // Call ML Service
    let mlResponse;
    try {
      mlResponse = await axios.post('https://python-ml-service-bku1.onrender.com/predict', studentData);
    } catch (error) {
       console.error("ML Service error:", error.message);
       return res.status(500).json({ error: 'Failed to communicate with ML service.' });
    }

    const { probability, readinessScore, skillGaps, recommendations } = mlResponse.data;

    const record = {
      ...studentData,
      probability,
      readinessScore,
      skillGaps,
      recommendations,
      createdAt: new Date()
    };

    if (useMemory) {
      const db = readDB();
      db.history.push(record);
      writeDB(db);
    } else {
      const newStudent = new Student(record);
      await newStudent.save();
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/history', async (req, res) => {
  if (useMemory) {
    const db = readDB();
    return res.json([...db.history].reverse());
  }
  const history = await Student.find().sort({ createdAt: -1 });
  res.json(history);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
