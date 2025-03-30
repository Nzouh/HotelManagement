// routes/hotelCapacity.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM HotelRoomCapacity');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching hotel capacity view:', err);
    res.status(500).json({ error: 'Failed to fetch hotel capacity data' });
  }
});

module.exports = router;
