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
  const { booking_id, c_sin, room_ID, dob, checkin, checkout } = req.body;

  if (!booking_id || !c_sin || !room_ID || !dob || !checkin || !checkout) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Booking (booking_id, dob, checkin, checkout, c_sin, room_ID)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [booking_id, dob, checkin, checkout, c_sin, room_ID];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error booking room:', err);
    res.status(500).json({ error: err.detail || 'Failed to book room' });
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
    res.status(500).json({ error: err.detail || 'Failed to fetch bookings' });
  }
});

// PUT /api/bookings/:booking_id
router.put('/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  const { room_id, c_sin, dob, checkin, checkout } = req.body;

  if (!room_id || !c_sin || !dob || !checkin || !checkout) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `UPDATE Booking
       SET room_ID = $1, c_sin = $2, dob = $3, checkin = $4, checkout = $5
       WHERE booking_id = $6
       RETURNING *;`,
      [room_id, c_sin, dob, checkin, checkout, booking_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:booking_id
router.delete('/:booking_id', async (req, res) => {
  const { booking_id } = req.params;

  try {
    await db.query('DELETE FROM Booking WHERE booking_id = $1', [booking_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});


module.exports = router;
