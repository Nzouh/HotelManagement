const express = require('express');
const router = express.Router();
const db = require('../db.js'); 

/**
 * GET /api/rooms
 * Basic route to fetch 10 rooms for testing
 */
router.get('/', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM Room;');
      res.json(rows);
    } catch (err) {
      console.error('Error in GET /api/rooms:', err);
      res.status(500).json({ error: err.detail || 'Internal server error' });
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

router.post('/', async (req, res) => {
  const { hotel_id, room_number, capacity, views, price, extendable, damages } = req.body;

  if (!hotel_id || !room_number || !capacity || !views || !price) {
    return res.status(400).json({ error:err.detail || 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Room (hotel_id, room_number, capacity, views, price, extendable, damages)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [hotel_id, room_number, capacity, views, price, extendable, damages || null];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error inserting room:', err);
    res.status(500).json({ error: err.detail || 'Failed to insert room' });
  }
});

router.put('/:room_id', async (req, res) => {
  const { room_id } = req.params;
  const { hotel_id, room_number, capacity, views, price, extendable, damages } = req.body;

  try {
    const result = await db.query(
      `UPDATE Room 
       SET hotel_id = $1, room_number = $2, capacity = $3, views = $4, price = $5, extendable = $6, damages = $7
       WHERE room_id = $8 RETURNING *;`,
      [hotel_id, room_number, capacity, views, price, extendable, damages || null, room_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: err.detail || 'Room not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

router.delete('/:room_id', async (req, res) => {
  const { room_id } = req.params;

  try {
    await db.query('DELETE FROM Room WHERE room_id = $1', [room_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ error:err.detail || 'Failed to delete room' });
  }
});

module.exports = router;
