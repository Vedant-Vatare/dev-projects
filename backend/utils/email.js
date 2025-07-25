import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(recipient, username, resetUrl) {
  const templatePath = path.join(
    process.cwd(),
    'templates',
    'passwordReset.html',
  );
  let html = fs.readFileSync(templatePath, 'utf8');

  html = html.replace(/{{username}}/g, username);
  html = html.replace(/{{resetUrl}}/g, resetUrl);

  try {
    const { error } = await resend.emails.send({
      from: 'Developers Projects <no-reply@developersprojects.tech>',
      to: recipient,
      subject: 'Password Reset',
      html: html,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { sendEmail };
