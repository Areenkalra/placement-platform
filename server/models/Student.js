const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  cgpa: Number,
  dsaCount: Number,
  projects: Number,
  internships: Number,
  certifications: Number,
  technicalSkills: [String],
  probability: Number,
  readinessScore: Number,
  skillGaps: [String],
  recommendations: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
