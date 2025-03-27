// routes/bookings.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

/**
 * POST /api/bookings
 * Creates a new booking record.
 * Required fields in request body:
 * - c_sin: Customer SIN
 * - room_id: ID of the room being booked
 * - dob: Date of booking
 * - checkin: Intended check-in date
 * - checkout: Intended check-out date
 */
router.post('/', async (req, res) => {
  const { booking_id,c_sin, room_id, dob, checkin, checkout } = req.body;

  if (!booking_id || !c_sin || !room_id || !dob || !checkin || !checkout) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Booking (booking_id, dob, checkin, checkout, c_sin, room_ID)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [booking_id,dob, checkin, checkout, c_sin, room_id];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error booking room:', err);
    res.status(500).json({ error: 'Failed to book room' });
  }
});

/**
 * GET /api/bookings
 * Returns all booking records ordered by date of booking.
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Booking ORDER BY dob DESC;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;
