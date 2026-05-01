const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], history: [], activityLog: [] }));
  }
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!db.activityLog) db.activityLog = [];
  return db;
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };
