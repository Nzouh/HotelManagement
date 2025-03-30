const express = require('express');
const router = express.Router();
const db = require('../db.js'); 

/**
 * GET /api/rooms
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
  const { area, capacity, price, start, end, hotel_id } = req.query;
  console.log("Backend received hotel_id:", hotel_id);

  let baseQuery = `
    SELECT r.* FROM Room r
    WHERE r.room_ID NOT IN (
      SELECT room_ID FROM Booking
      WHERE NOT (
        checkout < $1 OR checkin > $2
      )
    )
    AND r.room_ID NOT IN (
      SELECT room_ID FROM Renting
      WHERE NOT (
        r_edate < $1 OR r_sdate > $2
      )
    )
  `;

  const values = [start || '1900-01-01', end || '3000-01-01'];
  let i = values.length;

  if (area) {
    values.push(area);
    baseQuery += ` AND r.views = $${++i}`;
  }
  if (capacity) {
    values.push(capacity);
    baseQuery += ` AND r.capacity = $${++i}`;
  }
  if (price) {
    values.push(price);
    baseQuery += ` AND r.price <= $${++i}`;
  }
  if (hotel_id) {
    values.push(hotel_id);
    baseQuery += ` AND r.hotel_id = $${++i}`;
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
