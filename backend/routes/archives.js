// routes/archives.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');


router.post('/sync-rentings', async (req, res) => {
    try {
      const todayDate = new Date().toISOString().split('T')[0];
  
      // Find all rentings not yet in archives
      const result = await db.query(`
        SELECT * FROM Renting r
        WHERE NOT EXISTS (
          SELECT 1 FROM Archives a WHERE a.rent_id = r.rent_id
        );
      `);
  
      const rentings = result.rows;
      console.log("Inserted renting:", renting);

      for (const r of rentings) {
        await db.query(`
          INSERT INTO Archives (arch_id, rent_id, booking_id, c_sin, e_sin, chain_id, arch_date)
          VALUES ($1, $1, NULL, $2, $3, $4, $5);
        `, [r.rent_id, r.c_sin, r.e_sin, 1, todayDate]);
      }
      console.log("Archived renting successfully with rent_id:", rent_id);

      res.status(200).json({ message: `${rentings.length} rentings added to archives.` });
    } catch (err) {
      console.error("Error syncing rentings to archives:", err);
      res.status(500).json({ error: err.message || "Failed to sync rentings" });
    }
  });
  

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
    res.status(500).json({ error: err.detail || 'Failed to archive record' });
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
    res.status(500).json({error: 'Failed to fetch archive history'});
  }
});

module.exports = router;
