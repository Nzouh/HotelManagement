const express = require('express');
const router = express.Router();
const db = require('../db.js'); 

/**
 * GET /api/rooms
 * Basic route to fetch 10 rooms for testing
 */
router.get('/', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM Room LIMIT 10;');
      res.json(rows);
    } catch (err) {
      console.error('Error in GET /api/rooms:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

/**
 * GET /api/available-rooms
 * Route to fetch available rooms filtered by optional query params:
 * - area (views)
 * - capacity
 * - price
 * Example: /api/available-rooms?area=Sea&capacity=Double&price=200
 */
router.get('/available', async (req, res) => {
  const { area, capacity, price } = req.query;

  // Start building query
  let baseQuery = `
    SELECT * FROM Room r
    LEFT JOIN Renting rent ON r.room_ID = rent.room_ID
    WHERE rent.r_edate IS NULL OR CAST(rent.r_edate AS date) < CURRENT_DATE
  `;

  // Collect filters
  const filters = [];
  const values = [];

  if (area) {
    filters.push(`r.views = $${filters.length + 1}`);
    values.push(area);
  }
  if (capacity) {
    filters.push(`r.capacity = $${filters.length + 1}`);
    values.push(capacity);
  }
  if (price) {
    filters.push(`r.price <= $${filters.length + 1}`);
    values.push(price);
  }

  // Add filters to base query if any
  if (filters.length > 0) {
    baseQuery += ' AND ' + filters.join(' AND ');
  }

  try {
    const { rows } = await db.query(baseQuery, values);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching available rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
