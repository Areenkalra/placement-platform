const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/jsonDB');

// Log a new activity
router.post('/log', (req, res) => {
    try {
        const { email, action, details } = req.body;
        if (!email || !action) {
            return res.status(400).json({ error: "Email and action are required." });
        }
        
        const db = readDB();
        db.activityLog.push({
            id: Date.now().toString(),
            email,
            action,
            details: details || "",
            timestamp: new Date().toISOString()
        });
        
        writeDB(db);
        res.json({ success: true });
    } catch (err) {
        console.error("Failed to log activity", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch activity history
router.post('/history', (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }
        
        const db = readDB();
        const userActivities = db.activityLog
            .filter(log => log.email === email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
        res.json(userActivities);
    } catch (err) {
        console.error("Failed to fetch activity history", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
