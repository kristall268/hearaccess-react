const pool = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');

// GET /api/team — public
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM team_members ORDER BY id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/team/:id — public
exports.getOne = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM team_members WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/team — admin
exports.create = async (req, res) => {
  try {
    const { member_name, member_role, member_bio } = req.body;
    if (!member_name || !member_role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    let photo_url = null;
    let photo_public_id = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photo_url = result.secure_url;
      photo_public_id = result.public_id;
    }

    const { rows } = await pool.query(
      `INSERT INTO team_members (member_name, member_role, member_bio, photo_url, photo_public_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [member_name, member_role, member_bio || '', photo_url, photo_public_id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/team/:id — admin
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { member_name, member_role, member_bio, remove_photo } = req.body;

    const existing = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    let photo_url = existing.rows[0].photo_url;
    let photo_public_id = existing.rows[0].photo_public_id;

    if (req.file) {
      await deleteFromCloudinary(photo_public_id);
      const result = await uploadToCloudinary(req.file.buffer);
      photo_url = result.secure_url;
      photo_public_id = result.public_id;
    } else if (remove_photo === 'true') {
      await deleteFromCloudinary(photo_public_id);
      photo_url = null;
      photo_public_id = null;
    }

    const { rows } = await pool.query(
      `UPDATE team_members
       SET member_name = $1, member_role = $2, member_bio = $3, photo_url = $4, photo_public_id = $5
       WHERE id = $6 RETURNING *`,
      [member_name, member_role, member_bio || '', photo_url, photo_public_id, id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/team/:id — admin
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    await deleteFromCloudinary(existing.rows[0].photo_public_id);
    await pool.query('DELETE FROM team_members WHERE id = $1', [id]);

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
