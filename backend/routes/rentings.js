const express = require('express');
const router = express.Router();
const db = require('../db.js');


// POST /api/rentings
router.post('/', async (req, res) => {
    const { rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID } = req.body;
  
    if (!rent_id || !r_sdate || !r_edate || !e_sin || !c_sin || !room_ID) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const insertRes = await db.query(`
        INSERT INTO Renting (rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `, [rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID]);
  
      res.status(201).json(insertRes.rows[0]);
    } catch (err) {
      console.error("Error adding renting:", err);
      res.status(500).json({ error: err.message || "Failed to add renting" });
    }
  });
  
// POST /api/rentings/from-booking
router.post('/from-booking', async (req, res) => {
  const { booking_id, e_sin } = req.body;

  if (!booking_id || !e_sin) {
    return res.status(400).json({ error: "Missing booking_id or e_sin" });
  }

  try {
    const bookingRes = await db.query(
      "SELECT * FROM Booking WHERE booking_id = $1",
      [booking_id]
    );

    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingRes.rows[0];

    const insertRenting = await db.query(`
      INSERT INTO Renting (rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING rent_id;
    `, [
      booking.booking_id,
      booking.checkin,
      booking.checkout,
      e_sin,
      booking.c_sin,
      booking.room_id
    ]);

    const rent_id = insertRenting.rows[0].rent_id;

    const todayDate = new Date().toISOString().split('T')[0];

    await db.query(
      `INSERT INTO Archives (arch_id, rent_id, booking_id, c_sin, e_sin, chain_id, arch_date)
       VALUES ($1, $1, $2, $3, $4, $5, $6);`,
      [rent_id, booking.booking_id, booking.c_sin, e_sin, 1, todayDate] // TODO: dynamically set chain_id
    );

    res.status(201).json({ message: "Booking transferred to Renting successfully!" });
  } catch (err) {
    console.error("Error transferring booking to renting:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET /api/rentings
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Renting ORDER BY r_sdate DESC;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching rentings:', err);
    res.status(500).json({ error: err.detail || 'Failed to fetch rentings' });
  }
});

// PUT /api/rentings/:rent_id
router.put('/:rent_id', async (req, res) => {
  const { rent_id } = req.params;
  const { r_sdate, r_edate, e_sin, c_sin, room_ID } = req.body;

  if (!r_sdate || !r_edate || !e_sin || !c_sin || !room_ID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `UPDATE Renting SET r_sdate = $1, r_edate = $2, e_sin = $3, c_sin = $4, room_ID = $5
       WHERE rent_id = $6 RETURNING *;`,
      [r_sdate, r_edate, e_sin, c_sin, room_ID, rent_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Renting not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating renting:', err);
    res.status(500).json({ error: 'Failed to update renting' });
  }
});

// DELETE /api/rentings/:rent_id
router.delete('/:rent_id', async (req, res) => {
    const { rent_id } = req.params;
  
    try {
      // Set the foreign key in Archives to NULL instead of deleting
      await db.query(
        'UPDATE Archives SET rent_id = NULL WHERE rent_id = $1',
        [rent_id]
      );
  
      // Now delete the renting
      await db.query('DELETE FROM Renting WHERE rent_id = $1', [rent_id]);
  
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting renting:', err);
      res.status(500).json({ error: err.detail || 'Failed to delete renting' });
    }
  });
  

module.exports = router;
