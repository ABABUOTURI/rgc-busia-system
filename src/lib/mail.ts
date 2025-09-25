import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<void> {
  const tx = getTransporter();
  const subject = 'Your One-Time Password (OTP)';
  const text = `Your OTP code is ${otpCode}. It will expire in 5 minutes.`;
  const html = `<p>Your OTP code is <strong>${otpCode}</strong>. It will expire in 5 minutes.</p>`;

  if (!tx) {
    console.log(`[MAIL:DEV] Would send OTP ${otpCode} to ${toEmail}`);
    return;
  }
  await tx.sendMail({ from: SMTP_FROM as string, to: toEmail, subject, text, html });
}


