// backend/routes/hotels.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

/**
 * GET /api/hotels
 * Returns all hotels with address, email, number of rooms, and rating
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT hotel_id, chain_id, h_address, h_email, number_rooms, rating
      FROM Hotel
      ORDER BY hotel_id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

module.exports = router;
