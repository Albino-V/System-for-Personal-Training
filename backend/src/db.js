const { LowSync, JSONFileSync } = require('lowdb');
const path = require('path');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..');
const adapter = new JSONFileSync(path.join(dataDir, 'data.json'));
const db = new LowSync(adapter);
db.read();
if (!db.data) {
  db.data = { clients: [], checkins: [] };
  db.write();
}

module.exports = db;
