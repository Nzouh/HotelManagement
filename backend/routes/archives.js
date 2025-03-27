// routes/archives.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

/**
 * POST /api/archives
 * Archive a booking or renting record
 */
router.post('/', async (req, res) => {
  const { arch_id, rent_id, booking_id, c_sin, e_sin, chain_id, arch_date } = req.body;

  if (!arch_id || !arch_date || (!rent_id && !booking_id)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Archives (arch_id, rent_id, booking_id, c_sin, e_sin, chain_id, arch_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [arch_id, rent_id, booking_id, c_sin, e_sin, chain_id, arch_date];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error archiving:', err);
    res.status(500).json({ error: 'Failed to archive record' });
  }
});

/**
 * GET /api/archives
 * Retrieve all archive history
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Archives ORDER BY arch_date DESC;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching archive history:', err);
    res.status(500).json({ error: 'Failed to fetch archive history' });
  }
});

module.exports = router;
