const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/', async (req, res) => {
    const { rent_id, pay_info, dot } = req.body;
  
    if (!dot || !pay_info || !rent_id ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const query = `
        INSERT INTO Archives (rent_id, pay_info, dot)
        VALUES ($1, $2, $3,)
        RETURNING *;
      `;
      const values = [ rent_id,pay_info,dot];
      const { rows } = await db.query(query, values);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error archiving:', err);
      res.status(500).json({ error: err.detail || 'Failed to archive record' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM Payment ORDER BY dot DESC;');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching payments:', err);
      res.status(500).json({ error: err.detail ||'Failed to fetch payments' });
    }
  });

module.exports = router;
