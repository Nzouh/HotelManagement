const express = require('express');
const router = express.Router();
const db = require('../db.js');

// View 1: Aggregated capacity of rooms per hotel
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM HotelRoomCapacity');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching hotel capacity:', err);
    res.status(500).json({ error: 'Failed to fetch hotel capacity' });
  }
});


module.exports = router;
