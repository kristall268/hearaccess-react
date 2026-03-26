const pool = require('../config/db');
const { notifyPartnership, notifyVolunteer, notifyContact } = require('../services/mailer');

// ── Partnership ──────────────────────────────────────────
exports.submitPartnership = async (req, res) => {
  try {
    const { full_name, email, organization, message } = req.body;
    if (!full_name || !email || !organization) {
      return res.status(400).json({ error: 'Full name, email and organization are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO partnership_requests (full_name, email, organization, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [full_name, email, organization, message || '']
    );

    // Send admin notification (non-blocking — doesn't affect response)
    notifyPartnership({ full_name, email, organization, message });

    res.status(201).json({ message: 'Partnership request submitted successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ── Volunteer ────────────────────────────────────────────
exports.submitVolunteer = async (req, res) => {
  try {
    const { full_name, email, role, message } = req.body;
    if (!full_name || !email || !role) {
      return res.status(400).json({ error: 'Full name, email and role are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO volunteer_applications (full_name, email, role, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [full_name, email, role, message || '']
    );

    // Send admin notification (non-blocking)
    notifyVolunteer({ full_name, email, role, message });

    res.status(201).json({ message: 'Volunteer application submitted successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ── Contact ──────────────────────────────────────────────
exports.submitContact = async (req, res) => {
  try {
    const { full_name, email, subject, message } = req.body;
    if (!full_name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO contact_messages (full_name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [full_name, email, subject, message]
    );

    // Send admin notification (non-blocking)
    notifyContact({ full_name, email, subject, message });

    res.status(201).json({ message: 'Contact message sent successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
