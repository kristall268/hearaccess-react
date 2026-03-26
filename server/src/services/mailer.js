const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email notification to the admin.
 * Fails silently — form submission still succeeds even if email fails.
 */
async function notifyAdmin({ subject, html }) {
  const to = process.env.SMTP_TO;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !to) {
    console.warn('SMTP not configured — skipping email notification.');
    return;
  }

  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log(`Email sent: "${subject}" → ${to}`);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

/** Notify admin about a new partnership request */
function notifyPartnership({ full_name, email, organization, message }) {
  return notifyAdmin({
    subject: `[HerAccess] New Partnership Request — ${organization}`,
    html: `
      <h2 style="color:#3B1347;">New Partnership Request</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Name</td><td style="padding:6px 12px;">${esc(full_name)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Email</td><td style="padding:6px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Organization</td><td style="padding:6px 12px;">${esc(organization)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Message</td><td style="padding:6px 12px;">${esc(message) || '<em>—</em>'}</td></tr>
      </table>
    `,
  });
}

/** Notify admin about a new volunteer application */
function notifyVolunteer({ full_name, email, role, message }) {
  return notifyAdmin({
    subject: `[HerAccess] New Volunteer Application — ${role}`,
    html: `
      <h2 style="color:#3B1347;">New Volunteer Application</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Name</td><td style="padding:6px 12px;">${esc(full_name)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Email</td><td style="padding:6px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Role</td><td style="padding:6px 12px;">${esc(role)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Message</td><td style="padding:6px 12px;">${esc(message) || '<em>—</em>'}</td></tr>
      </table>
    `,
  });
}

/** Notify admin about a new contact message */
function notifyContact({ full_name, email, subject, message }) {
  return notifyAdmin({
    subject: `[HerAccess] New Contact Message — ${subject}`,
    html: `
      <h2 style="color:#3B1347;">New Contact Message</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Name</td><td style="padding:6px 12px;">${esc(full_name)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Email</td><td style="padding:6px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Subject</td><td style="padding:6px 12px;">${esc(subject)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;color:#6b4f7a;">Message</td><td style="padding:6px 12px;">${esc(message)}</td></tr>
      </table>
    `,
  });
}

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = { notifyPartnership, notifyVolunteer, notifyContact };
