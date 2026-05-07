const { LowSync, JSONFileSync } = require('lowdb');
const path = require('path');

const adapter = new JSONFileSync(path.join(__dirname, '..', 'data.json'));
const db = new LowSync(adapter);
db.read();
if (!db.data) {
  db.data = { clients: [], checkins: [] };
  db.write();
}

module.exports = db;
