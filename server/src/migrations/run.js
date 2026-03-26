require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Admin users ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Team members ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        member_name VARCHAR(200) NOT NULL,
        member_role VARCHAR(200) NOT NULL,
        member_bio VARCHAR(1000) DEFAULT '',
        photo_url VARCHAR(500),
        photo_public_id VARCHAR(300),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Add photo_public_id column if missing (for existing databases)
    await client.query(`
      ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_public_id VARCHAR(300);
    `);

    // ── Partnership requests ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS partnership_requests (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        organization VARCHAR(300) NOT NULL,
        message VARCHAR(2000) DEFAULT '',
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Volunteer applications ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS volunteer_applications (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        role VARCHAR(200) NOT NULL,
        message VARCHAR(2000) DEFAULT '',
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Contact messages ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        subject VARCHAR(300) NOT NULL,
        message VARCHAR(4000) NOT NULL,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Seed admin user if none exists ──
    const { rows } = await client.query('SELECT id FROM admin_users LIMIT 1');
    if (rows.length === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcrypt.hash(password, 12);
      await client.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [username, hash]
      );
      console.log(`Admin user "${username}" seeded.`);
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
