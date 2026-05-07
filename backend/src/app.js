require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clientsRouter = require('./routes/clients');
const checkinsRouter = require('./routes/checkins');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/clients', clientsRouter);
app.use('/api/checkins', checkinsRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Check-in API running on port ${PORT}`));
