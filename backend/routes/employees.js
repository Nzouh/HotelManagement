// routes/employees.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

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

/**
 * GET /api/customers
 * Retrieves all customers
 */
router.get('/', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM Employee ORDER BY e_name;');
      res.json(rows);
    } catch (err) {
      console.error('Error retrieving employees:', err);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  });

  router.put('/:e_sin', async (req, res) => {
    const { e_sin } = req.params;
    const { e_name, e_address, pos } = req.body;
    try {
      const result = await db.query(
        `UPDATE Employee SET e_name = $1, e_address = $2, pos = $3
         WHERE e_sin = $4 RETURNING *;`,
        [e_name, e_address, pos, e_sin]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  });
  
  // DELETE an employee
  router.delete('/:e_sin', async (req, res) => {
    const { e_sin } = req.params;
    try {
      await db.query('DELETE FROM Employee WHERE e_sin = $1', [e_sin]);
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  });

module.exports = router;
