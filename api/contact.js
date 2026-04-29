// api/contact.js
// Vercel Serverless Function — Nodemailer + Gmail App Password
// ──────────────────────────────────────────────────────────────
// Set these environment variables in your Vercel project settings:
//   EMAIL_USER  — your Gmail address (e.g. marissa@gmail.com)
//   EMAIL_PASS  — your Google App Password (16-char, no spaces)
//   EMAIL_TO    — recipient address (defaults to EMAIL_USER)

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // ── CORS Headers ──────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Parse Body ────────────────────────────────────────────────
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // ── Validate email format ────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // ── Configure Transporter ─────────────────────────────────────
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Google App Password
    },
  });

  // ── Build HTML email ──────────────────────────────────────────
  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin: 0; padding: 0; background: #f3e8ff; font-family: 'Segoe UI', sans-serif; }
    .wrap { max-width: 580px; margin: 32px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(124,58,237,.12); }
    .header { background: linear-gradient(135deg, #7c3aed, #e879f9); padding: 32px 36px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
    .header p  { margin: 6px 0 0; color: rgba(255,255,255,.75); font-size: .9rem; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 20px; }
    .label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #7c3aed; margin-bottom: 4px; }
    .value { font-size: .95rem; color: #374151; background: #f9f5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 10px 14px; }
    .msg-box { background: #f9f5ff; border: 1px solid #e9d5ff; border-left: 4px solid #7c3aed; border-radius: 10px; padding: 16px; line-height: 1.65; color: #374151; white-space: pre-line; }
    .footer { text-align: center; padding: 18px 36px 28px; font-size: .75rem; color: #9ca3af; }
    .footer em { color: #a78bfa; font-style: normal; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>💌 New Portfolio Message</h1>
      <p>Someone reached out through your portfolio</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value">${escapeHtml(email)}</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${escapeHtml(subject || '(no subject)')}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="msg-box">${escapeHtml(message)}</div>
      </div>
    </div>
    <div class="footer">
      Sent from <em>Marissa's Portfolio</em> — Reply directly to this email to respond.
    </div>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: `"Marissa Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `✨ Portfolio: ${subject || 'Message'} — from ${name}`,
    html: htmlBody,
    text: `New portfolio contact\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject || '(none)'}\n\n${message}`,
  };

  // ── Send ──────────────────────────────────────────────────────
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('[contact] Email error:', err.message);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
};

/* Helpers */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}