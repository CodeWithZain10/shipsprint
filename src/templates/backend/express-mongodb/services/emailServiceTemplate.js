const emailServiceTemplate = () => {
return `import nodemailer from 'nodemailer';

const createTransport = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development — print to console instead of sending
  return {
    sendMail: async (options) => {
      console.log('\\n📧 [DEV EMAIL]');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.text || options.html);
      console.log('---\\n');
      return { messageId: 'dev-console' };
    },
  };
};

const transporter = createTransport();

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    console.error('Email send failed:', err.message);
    // Fail silently — do not crash the request
  }
};

export const sendPasswordResetEmail = (to, resetLink) => 
  sendMail({
    to,
    subject: 'Reset your password',
    text: \`Click the link to reset your password (valid 30 minutes):\\n\\n\${resetLink}\\n\\nIf you did not request this, ignore this email.\`,
    html: \`<p>Click the link below to reset your password (valid 30 minutes):</p><a href="\${resetLink}">\${resetLink}</a><p>If you did not request this, ignore this email.</p>\`,
  });

export const sendVerificationEmail = (to, verifyLink) =>
  sendMail({
    to,
    subject: 'Verify your email',
    text: \`Click the link to verify your email (valid 24 hours):\\n\\n\${verifyLink}\`,
    html: \`<p>Click the link below to verify your email (valid 24 hours):</p><a href="\${verifyLink}">\${verifyLink}</a>\`,
  });

export const sendWelcomeEmail = (to, username) =>
  sendMail({
    to,
    subject: 'Welcome!',
    text: \`Hi \${username}, welcome aboard! Your account is ready.\`,
    html: \`<p>Hi <strong>\${username}</strong>, welcome aboard! Your account is ready.</p>\`,
  });
`
}

export default emailServiceTemplate;