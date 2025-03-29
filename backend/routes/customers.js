const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/customers
 * Creates a new customer
 */
router.post('/', async (req, res) => {
    const { c_sin, c_name, c_email, c_address, dor } = req.body;
  
    if (!c_sin || !c_name || !c_email || !c_address || !dor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const result = await db.query(
        `INSERT INTO Customer (c_sin, c_name, c_email, c_address, dor)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [c_sin, c_name, c_email, c_address, dor]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error inserting customer:', err);
      res.status(500).json({ error: 'Failed to insert customer' });
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

// DELETE /api/customers/:c_sin
router.delete('/:c_sin', async (req, res) => {
    const { c_sin } = req.params;
  
    try {
      const query = 'DELETE FROM Customer WHERE c_sin = $1';
      const result = await db.query(query, [c_sin]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.status(200).json({ message: 'Customer deleted' });
    } catch (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  });
  
  router.put('/:c_sin', async (req, res) => {
    const { c_sin } = req.params;
    const { c_name, c_email, c_address, dor } = req.body;
  
    try {
      const query = `
        UPDATE Customer
        SET c_name = $1, c_email = $2, c_address = $3, dor = $4
        WHERE c_sin = $5
        RETURNING *;
      `;
      const values = [c_name, c_email, c_address, dor, c_sin];
      const { rows } = await db.query(query, values);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({ error: 'Failed to update customer' });
    }
  });

module.exports = router;
