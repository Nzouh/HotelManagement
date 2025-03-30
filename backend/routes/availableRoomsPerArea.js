// routes/availableRoomsPerArea.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM AvailableRoomsPerArea');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching available rooms per area:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
