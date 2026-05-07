const express = require('express');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  db.read();
  res.json([...db.data.clients].sort((a, b) => a.name.localeCompare(b.name)));
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });

  const client = {
    id: uuidv4(),
    name: name.trim(),
    email: email || null,
    phone: phone || null,
    created_at: new Date().toISOString(),
  };
  db.data.clients.push(client);
  db.write();
  res.status(201).json(client);
});

router.get('/:id/qr', async (req, res) => {
  db.read();
  const client = db.data.clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found.' });

  const checkinUrl = `${process.env.FRONTEND_URL}/checkin/${client.id}`;
  const qrDataUrl = await QRCode.toDataURL(checkinUrl, { width: 400, margin: 2 });
  res.json({ qr: qrDataUrl, url: checkinUrl, client });
});

router.delete('/:id', (req, res) => {
  db.data.clients = db.data.clients.filter((c) => c.id !== req.params.id);
  db.write();
  res.status(204).end();
});

module.exports = router;
