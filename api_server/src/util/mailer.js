import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail(to, subject, text, html) {
  if (!transporter) {
    console.warn('SMTP not configured, skipping sendEmail to', to);
    return;
  }

  const mailOptions = {
    from: FROM_EMAIL,
    to,
    subject,
    text,
  };

  if (html) mailOptions.html = html;

  await transporter.sendMail(mailOptions);
}
