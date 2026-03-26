const pool = require('../config/db');

const PAGE_SIZE = 10;

// GET /api/admin/submissions?tab=partnerships&page=1
exports.getSubmissions = async (req, res) => {
  try {
    const tab = req.query.tab || 'partnerships';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    let table, orderCol;
    switch (tab) {
      case 'volunteers':
        table = 'volunteer_applications';
        orderCol = 'submitted_at';
        break;
      case 'contacts':
        table = 'contact_messages';
        orderCol = 'submitted_at';
        break;
      default:
        table = 'partnership_requests';
        orderCol = 'submitted_at';
    }

    const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const { rows } = await pool.query(
      `SELECT * FROM ${table} ORDER BY ${orderCol} DESC LIMIT $1 OFFSET $2`,
      [PAGE_SIZE, offset]
    );

    // Also fetch counts for all tabs
    const [pCount, vCount, cCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM partnership_requests'),
      pool.query('SELECT COUNT(*) FROM volunteer_applications'),
      pool.query('SELECT COUNT(*) FROM contact_messages'),
    ]);

    res.json({
      tab,
      data: rows,
      page,
      totalPages,
      total,
      counts: {
        partnerships: parseInt(pCount.rows[0].count),
        volunteers: parseInt(vCount.rows[0].count),
        contacts: parseInt(cCount.rows[0].count),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
