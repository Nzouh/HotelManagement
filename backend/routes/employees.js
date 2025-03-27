// routes/employees.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/employees
 * Add a new employee to the system
 */
router.post('/', async (req, res) => {
  const { e_sin, e_name, e_address, pos } = req.body;

  if (!e_sin || !e_name || !e_address || !pos) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Employee (e_sin, e_name, e_address, pos)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [e_sin, e_name, e_address, pos];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error inserting employee:', err);
    res.status(500).json({ error: 'Failed to insert employee' });
  }
});

module.exports = router;
