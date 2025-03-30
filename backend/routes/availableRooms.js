// backend/routes/availableRooms.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET /api/available-rooms
// Returns hotel address, area (view), and count of available rooms
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "AvailableRoomsPerArea";');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching available rooms:', err);
    res.status(500).json({ error: err.detail || 'Failed to fetch available rooms' });
  }
});

module.exports = router;
