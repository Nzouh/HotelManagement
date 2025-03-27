const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/customers
 * Creates a new customer
 */
router.post('/', async (req, res) => {
  const { c_sin, c_name, c_email, c_address, dor } = req.body;

  if (!c_sin || !c_name || !c_email || !c_address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Customer (c_sin, c_name, c_email, c_address, dor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [c_sin, c_name, c_email, c_address, dor || null];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

/**
 * GET /api/customers
 * Retrieves all customers
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Customer ORDER BY c_name;');
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
