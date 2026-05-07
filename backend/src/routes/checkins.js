const express = require('express');
const db = require('../db');
const { appendCheckin } = require('../services/sheets');

const router = express.Router();

router.post('/:clientId', async (req, res) => {
  db.read();
  const client = db.data.clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: 'Client not found.' });

  const checkin = {
    id: Date.now(),
    client_id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    checked_in_at: new Date().toISOString(),
  };
  db.data.checkins.push(checkin);
  db.write();

  appendCheckin(client.name, client.id, checkin.checked_in_at).catch((err) =>
    console.error('[Sheets] Failed to sync:', err.message)
  );

  res.status(201).json({
    message: `Welcome, ${client.name}! Check-in recorded.`,
    client_name: client.name,
    checked_in_at: checkin.checked_in_at,
    id: checkin.id,
  });
});

router.get('/', (req, res) => {
  db.read();
  const target = req.query.date || new Date().toISOString().slice(0, 10);
  const rows = db.data.checkins
    .filter((c) => c.checked_in_at.startsWith(target))
    .sort((a, b) => b.checked_in_at.localeCompare(a.checked_in_at));
  res.json({ date: target, count: rows.length, checkins: rows });
});

router.get('/history', (req, res) => {
  db.read();
  const byDay = {};
  for (const c of db.data.checkins) {
    const day = c.checked_in_at.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  const rows = Object.entries(byDay)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30)
    .map(([day, total]) => ({ day, total }));
  res.json(rows);
});

module.exports = router;
