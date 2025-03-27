const express = require('express');
const router = express.Router();
const db = require('../db.js');

// POST /api/rentings
// This route creates a new renting
// Required in the body: rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID
router.post('/', async (req, res) => {
  const { rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID } = req.body;

  if (!rent_id || !r_sdate || !r_edate || !e_sin || !c_sin || !room_ID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Renting (rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [rent_id, r_sdate, r_edate, e_sin, c_sin, room_ID];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating renting:', err);
    res.status(500).json({ error: 'Failed to create renting' });
  }
});

router.get('/', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM Renting ORDER BY r_sdate DESC;');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching rentings:', err);
      res.status(500).json({ error: 'Failed to fetch rentings' });
    }
  });
  

module.exports = router;
