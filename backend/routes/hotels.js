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

router.post('/', async (req, res) => {
  const { hotel_id, h_address, h_email, number_rooms, rating, chain_id } = req.body;
  if (!hotel_id || !h_address || !h_email || !number_rooms || !rating || !chain_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `INSERT INTO Hotel (hotel_id, chain_id, h_address, h_email, number_rooms, rating)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [hotel_id, chain_id, h_address, h_email, number_rooms, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting hotel:', err);
    res.status(500).json({ error: err.detail || 'Failed to insert hotel' });
  }
});

router.put('/:hotel_id', async (req, res) => {
  const { hotel_id } = req.params;
  const { h_address, h_email, number_rooms, rating, chain_id } = req.body;

  try {
    const result = await db.query(
      `UPDATE Hotel SET chain_id = $1, h_address = $2, h_email = $3,
       number_rooms = $4, rating = $5 WHERE hotel_id = $6 RETURNING *;`,
      [chain_id, h_address, h_email, number_rooms, rating, hotel_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating hotel:', err);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

router.delete('/:hotel_id', async (req, res) => {
  const { hotel_id } = req.params;

  try {
    await db.query('DELETE FROM Hotel WHERE hotel_id = $1', [hotel_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting hotel:', err);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});


module.exports = router;
