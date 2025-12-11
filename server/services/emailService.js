import nodemailer from 'nodemailer';

// Get frontend URL from environment variable or fallback to localhost
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Determine which email service to use
const useSendGrid = process.env.SENDGRID_API_KEY;
const emailService = useSendGrid ? 'SendGrid' : 'Gmail';

// Log email configuration (without showing sensitive data)
console.log('📧 Email Service Configuration:', {
  service: emailService,
  user: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'NOT SET',
  sendGridConfigured: !!process.env.SENDGRID_API_KEY,
  gmailConfigured: !!process.env.EMAIL_PASS,
  frontendUrl: FRONTEND_URL
});

// Create transporter based on available credentials
let transporter;

if (useSendGrid) {
  // Use SendGrid for production (works on Render)
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
  console.log('📧 Using SendGrid for email delivery');
} else {
  // Use Gmail for local development
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log('📧 Using Gmail for email delivery');
}

// Verify transporter (optional, don't block startup)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    if (useSendGrid) {
      console.error('⚠️ SendGrid issue - Please check:');
      console.error('   1. SENDGRID_API_KEY environment variable is set correctly');
      console.error('   2. API key has "Mail Send" permissions');
      console.error('   3. Sender email is verified in SendGrid');
    } else {
      console.error('⚠️ Gmail issue - Please check:');
      console.error('   1. EMAIL_USER environment variable is set correctly');
      console.error('   2. EMAIL_PASS is a Gmail App Password (not regular password)');
      console.error('   3. 2-Step Verification is enabled on Gmail');
      console.error('   4. SMTP connections are not blocked by your hosting provider');
    }
  } else {
    console.log(`✅ Email service (${emailService}) is ready to send messages`);
  }
});

export const sendSignupEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to SyncBoard! 🚀 Your Account is Ready',
      html: generateSignupHTML(firstName, email),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Signup email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending signup email:', error.message);
    throw error;
  }
};

function generateSignupHTML(firstName, email) {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: #333;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
          color: #333;
        }
        .header p {
          font-size: 14px;
          opacity: 0.8;
          color: #555;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message {
          color: #555;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        .features {
          background: #f8f9ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          border-radius: 6px;
          margin: 30px 0;
        }
        .features h3 {
          color: #667eea;
          font-size: 16px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .feature-item {
          display: flex;
          align-items: start;
          margin-bottom: 12px;
          font-size: 14px;
          color: #555;
        }
        .feature-icon {
          width: 24px;
          height: 24px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 12px;
          font-weight: bold;
        }
        .cta-button {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button a {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cta-button a:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .account-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          font-size: 13px;
          color: #856404;
        }
        .account-info strong {
          display: block;
          margin-bottom: 5px;
        }
        .divider {
          height: 1px;
          background: #eee;
          margin: 30px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .social-links {
          margin: 15px 0 0 0;
        }
        .social-links a {
          display: inline-block;
          width: 32px;
          height: 32px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 32px;
          margin: 0 5px;
          text-decoration: none;
          font-size: 16px;
        }
        .social-links a:hover {
          background: #764ba2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>SyncBoard</h1>
          <p>Your Intelligent Task Management Companion</p>
        </div>

        <div class="content">
          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to SyncBoard!</h2>

          <p class="greeting">Hii, ${firstName}! 👋</p>
          
          <p class="message">
            Thank you for joining SyncBoard! We're thrilled to have you on board. Your account has been created successfully, 
            and you're all set to start managing your tasks like a pro.
          </p>

          <!-- Features -->
          <div class="features">
            <h3>✨ What You Can Do Now</h3>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>Create and organize tasks with custom categories</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>Set priorities and due dates for better planning</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>Track progress with visual task boards</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>Collaborate with team members (coming soon)</div>
            </div>
          </div>

          <!-- Account Info -->
          <div class="account-info">
            <strong>Account Email:</strong>
            ${email}
          </div>

          <!-- CTA Button -->
          <div class="cta-button">
            <a href="${FRONTEND_URL}/login">Get Started Now →</a>
          </div>

          <p class="message" style="font-size: 13px; text-align: center; color: #999;">
            If you didn't create this account, please ignore this email or contact our support team.
          </p>

          <div class="divider"></div>

          <!-- Tips -->
          <div style="background: #e7f3ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #0066cc; font-size: 14px; margin-bottom: 10px;">💡 Pro Tips</h3>
            <ul style="list-style: none; font-size: 13px; color: #555; line-height: 1.8;">
              <li>✏️ Create task templates to save time on repetitive work</li>
              <li>⏰ Use reminders to stay on top of your deadlines</li>
              <li>📊 Review your task analytics to improve productivity</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}">Visit SyncBoard</a> | 
            <a href="${FRONTEND_URL}/help">Help Center</a> | 
            <a href="${FRONTEND_URL}/settings">Settings</a>
          </p>
          <div class="social-links">
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="LinkedIn">in</a>
            <a href="#" title="GitHub">gh</a>
          </div>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you signed up for SyncBoard.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const sendPasswordResetEmail = async (email, firstName, resetLink) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your SyncBoard Password 🔐',
      html: generatePasswordResetHTML(firstName, resetLink),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    throw error;
  }
};

function generatePasswordResetHTML(firstName, resetLink) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .cta-button {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button a {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-size: 13px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName},</p>
          <p style="color: #555; line-height: 1.8;">We received a request to reset your SyncBoard password.</p>
          <p style="color: #555; line-height: 1.8;">Click the button below to reset your password. This link is valid for <strong>1 hour</strong>:</p>
          <div class="cta-button">
            <a href="${resetLink}">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged and secure.
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            Or copy and paste this link into your browser:<br>
            <span style="color: #667eea;">${resetLink}</span>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SyncBoard. All rights reserved.</p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const sendWelcomeEmailWithPassword = async (email, firstName, password, userDetails = {}) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to SyncBoard! 🚀 Your Account is Ready',
      html: generateWelcomeWithPasswordHTML(firstName, email, password, userDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email with password sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email with password:', error.message);
    throw error;
  }
};

function generateWelcomeWithPasswordHTML(firstName, email, password, userDetails = {}) {
  const currentYear = new Date().getFullYear();
  const { role, managerName, projects } = userDetails;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; font-weight: 600; }
        .message { color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
        .info-box {
          background: #f8f9ff;
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .info-box h3 { color: #667eea; font-size: 16px; margin-bottom: 15px; font-weight: 600; }
        .info-item {
          background: white;
          padding: 12px 15px;
          border-radius: 6px;
          margin-bottom: 10px;
          border: 1px solid #e0e0e0;
        }
        .info-label { font-size: 12px; color: #999; text-transform: uppercase; margin-bottom: 5px; }
        .info-value { font-size: 16px; color: #333; font-weight: 600; }
        .password-value {
          background: #fff3cd;
          padding: 8px 12px;
          border-radius: 4px;
          display: inline-block;
          border: 1px dashed #ffc107;
          font-family: 'Courier New', monospace;
        }
        .role-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .project-list {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 15px;
          margin-top: 10px;
        }
        .project-item {
          padding: 8px 12px;
          background: white;
          border-radius: 4px;
          margin-bottom: 8px;
          border-left: 3px solid #667eea;
          font-size: 14px;
          color: #555;
        }
        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 13px;
          color: #856404;
        }
        .cta-button { text-align: center; margin: 30px 0; }
        .cta-button a {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">SyncBoard</h1>
          <p style="color: #555;">Your Intelligent Task Management Companion</p>
        </div>
        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName}! 👋</p>
          <p class="message" style="color: #555;">
            Welcome to SyncBoard! Your account has been created by your administrator.
            We're excited to have you on board and help you manage your tasks efficiently.
          </p>

          <!-- Account Details -->
          <div class="info-box">
            <h3>👤 Your Account Details</h3>
            ${role ? `
            <div class="info-item">
              <div class="info-label">Role</div>
              <div class="info-value"><span class="role-badge">${role}</span></div>
            </div>
            ` : ''}
            ${managerName ? `
            <div class="info-item">
              <div class="info-label">Reporting Manager</div>
              <div class="info-value">${managerName}</div>
            </div>
            ` : ''}
            ${projects && projects.length > 0 ? `
            <div class="info-item">
              <div class="info-label">Assigned Projects</div>
              <div class="project-list">
                ${projects.map(p => `<div class="project-item">📋 ${p.name}</div>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Login Credentials -->
          <div class="info-box">
            <h3>🔐 Your Login Credentials</h3>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${email}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Temporary Password</div>
              <div class="info-value password-value">${password}</div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="warning-box">
            <strong>🔒 Security Recommendation:</strong><br>
            For your security, please change this temporary password after your first login.
            Go to Settings → Change Password after logging in.
          </div>

          <!-- CTA Button -->
          <div class="cta-button">
            <a href="${FRONTEND_URL}/login">Login to SyncBoard →</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Visit SyncBoard</a> |
            <a href="${FRONTEND_URL}/help" style="color: #667eea; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because an administrator created a SyncBoard account for you.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const sendAccountDeletedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SyncBoard Account Has Been Deleted 👋',
      html: generateAccountDeletedHTML(firstName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Account deletion email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending account deletion email:', error.message);
    throw error;
  }
};

function generateAccountDeletedHTML(firstName) {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message {
          color: #555;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .info-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
          font-size: 14px;
          color: #856404;
        }
        .reason-box {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .reason-box h3 {
          color: #333;
          font-size: 16px;
          margin-bottom: 15px;
        }
        .reason-item {
          display: flex;
          align-items: start;
          margin-bottom: 10px;
          font-size: 14px;
          color: #555;
        }
        .reason-icon {
          width: 24px;
          height: 24px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 12px;
          font-weight: bold;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .support-link {
          text-align: center;
          margin: 20px 0;
        }
        .support-link a {
          display: inline-block;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 style="color: #333;">Account Deleted</h1>
        </div>

        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName},</p>
          
          <p class="message" style="color: #555;">
            This email confirms that your SyncBoard account has been permanently deleted. All your data, tasks, and settings have been removed from our servers.
          </p>

          <!-- Info Box -->
          <div class="info-box">
            <strong>⏰ Timing:</strong><br>
            Your account and all associated data will be fully removed from our systems within 24 hours.
          </div>

          <!-- What happens next -->
          <div class="reason-box">
            <h3>📋 What Happens Next</h3>
            <div class="reason-item">
              <div class="reason-icon">✓</div>
              <div>Your account is immediately deactivated</div>
            </div>
            <div class="reason-item">
              <div class="reason-icon">✓</div>
              <div>All tasks, projects, and related data are deleted</div>
            </div>
            <div class="reason-item">
              <div class="reason-icon">✓</div>
              <div>You can no longer sign in with this email</div>
            </div>
            <div class="reason-item">
              <div class="reason-icon">✓</div>
              <div>Complete data removal within 24 hours</div>
            </div>
          </div>

          <p class="message" style="font-size: 14px;">
            <strong>Miss SyncBoard?</strong> You can always create a new account with the same email address anytime. We'll be glad to have you back!
          </p>

          <!-- Support -->
          <div class="support-link">
            <p style="font-size: 13px; color: #555; margin-bottom: 10px;">Have questions or need help?</p>
            <a href="${FRONTEND_URL}/help">Contact Support</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}">Visit SyncBoard</a> | 
            <a href="${FRONTEND_URL}/help">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you deleted your SyncBoard account.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const sendRoleChangeEmail = async (email, firstName, oldRole, newRole) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Role Has Been Updated - SyncBoard',
      html: generateRoleChangeHTML(firstName, oldRole, newRole),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Role change email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending role change email:', error.message);
    throw error;
  }
};

function generateRoleChangeHTML(firstName, oldRole, newRole) {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; font-weight: 600; }
        .message { color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
        .role-change-box {
          background: #f8f9ff;
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          text-align: center;
        }
        .role-badge {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 600;
          margin: 10px;
        }
        .old-role { background: #e9ecef; color: #6c757d; text-decoration: line-through; }
        .new-role { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .arrow { font-size: 24px; color: #667eea; margin: 0 10px; }
        .info-box {
          background: #e7f3ff;
          border-left: 4px solid #0066cc;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 14px;
          color: #004085;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">🎉 Role Updated</h1>
          <p style="color: #555;">Your SyncBoard Role Has Changed</p>
        </div>
        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName}! 👋</p>
          <p class="message" style="color: #555;">
            Great news! Your role in SyncBoard has been updated by your administrator.
            This change may affect your permissions and access to features.
          </p>

          <div class="role-change-box">
            <h3 style="color: #667eea; margin-bottom: 20px;">Role Transition</h3>
            <div>
              <span class="role-badge old-role">${oldRole}</span>
              <span class="arrow">→</span>
              <span class="role-badge new-role">${newRole}</span>
            </div>
          </div>

          <div class="info-box">
            <strong>📌 What This Means:</strong><br>
            Your new role may grant you additional permissions or change your access level.
            Please log in to explore your updated capabilities.
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Login to SyncBoard →
            </a>
          </div>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Visit SyncBoard</a> |
            <a href="${FRONTEND_URL}/help" style="color: #667eea; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because your SyncBoard role was updated.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const sendProjectAssignmentEmail = async (email, firstName, addedProjects, removedProjects) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Project Assignments Have Been Updated - SyncBoard',
      html: generateProjectAssignmentHTML(firstName, addedProjects, removedProjects),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Project assignment email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending project assignment email:', error.message);
    throw error;
  }
};

function generateProjectAssignmentHTML(firstName, addedProjects, removedProjects) {
  const currentYear = new Date().getFullYear();
  const hasAdditions = addedProjects && addedProjects.length > 0;
  const hasRemovals = removedProjects && removedProjects.length > 0;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; font-weight: 600; }
        .message { color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
        .projects-box {
          background: #f8f9ff;
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .projects-box h3 { color: #667eea; font-size: 16px; margin-bottom: 15px; font-weight: 600; }
        .project-item {
          padding: 12px 15px;
          background: white;
          border-radius: 6px;
          margin-bottom: 10px;
          border-left: 3px solid #28a745;
          font-size: 14px;
          color: #555;
        }
        .project-item-removed {
          border-left-color: #dc3545;
          opacity: 0.7;
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 10px;
        }
        .badge-added { background: #d4edda; color: #155724; }
        .badge-removed { background: #f8d7da; color: #721c24; }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">📋 Projects Updated</h1>
          <p style="color: #555;">Your Project Assignments Have Changed</p>
        </div>
        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName}! 👋</p>
          <p class="message" style="color: #555;">
            Your administrator has updated your project assignments in SyncBoard.
            Here's a summary of the changes:
          </p>

          ${hasAdditions ? `
          <div class="projects-box">
            <h3>✅ Added Projects</h3>
            ${addedProjects.map(p => `
              <div class="project-item">
                📋 ${p.name}
                <span class="badge badge-added">NEW</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${hasRemovals ? `
          <div class="projects-box">
            <h3>❌ Removed Projects</h3>
            ${removedProjects.map(p => `
              <div class="project-item project-item-removed">
                📋 ${p.name}
                <span class="badge badge-removed">REMOVED</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/projects" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
              View Your Projects →
            </a>
          </div>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Visit SyncBoard</a> |
            <a href="${FRONTEND_URL}/help" style="color: #667eea; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because your SyncBoard project assignments were updated.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send account details email (with role and project info)
export const sendAccountDetailsEmail = async (email, firstName, role, projects = []) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SyncBoard Account Details 📋',
      html: generateAccountDetailsHTML(firstName, email, role, projects),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Account details email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending account details email:', error.message);
    throw error;
  }
};

function generateAccountDetailsHTML(firstName, email, role, projects) {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 700;
          color: white;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .details-box {
          background: #f8f9ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
          font-size: 14px;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #555;
        }
        .detail-value {
          color: #333;
          font-weight: 500;
        }
        .projects-section {
          margin: 20px 0;
        }
        .projects-section h3 {
          color: #333;
          font-size: 16px;
          margin-bottom: 15px;
        }
        .project-list {
          list-style: none;
          padding: 0;
        }
        .project-item {
          background: #f0f4ff;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-left: 4px solid #667eea;
          border-radius: 4px;
          font-size: 14px;
          color: #333;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">📋 Account Details</h1>
        </div>

        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName},</p>
          
          <p style="color: #555; line-height: 1.8; margin-bottom: 20px;">
            Your account has been created on SyncBoard. Here are your account details:
          </p>

          <div class="details-box">
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Role:</span>
              <span class="detail-value"><strong>${role}</strong></span>
            </div>
          </div>

          ${projects && projects.length > 0 ? `
            <div class="projects-section">
              <h3>📁 Assigned Projects:</h3>
              <ul class="project-list">
                ${projects.map(project => `<li class="project-item">✓ ${project}</li>`).join('')}
              </ul>
            </div>
          ` : `
            <div class="projects-section">
              <p style="color: #999; font-size: 14px;">No projects assigned yet.</p>
            </div>
          `}

          <p style="color: #555; line-height: 1.8; margin-top: 20px; font-size: 14px;">
            If you have any questions about your account or need assistance, please contact your administrator.
          </p>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}">Visit SyncBoard</a> | 
            <a href="${FRONTEND_URL}/help">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because your account was created on SyncBoard.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send user update notification email
export const sendUserUpdateEmail = async (email, firstName, updatedFields = {}) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SyncBoard Account Has Been Updated 📝',
      html: generateUserUpdateHTML(firstName, updatedFields),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ User update email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending user update email:', error.message);
    throw error;
  }
};

function generateUserUpdateHTML(firstName, updatedFields) {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 700;
          color: white;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .update-box {
          background: #f0f4ff;
          border-left: 4px solid #17a2b8;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .update-item {
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
        }
        .update-item:last-child {
          border-bottom: none;
        }
        .update-label {
          font-weight: 600;
          color: #17a2b8;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">📝 Account Updated</h1>
        </div>

        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName},</p>
          
          <p style="color: #555; line-height: 1.8; margin-bottom: 20px;">
            Your SyncBoard account has been updated. Here are the changes made:
          </p>

          <div class="update-box">
            ${Object.entries(updatedFields).map(([key, value]) => `
              <div class="update-item">
                <span class="update-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span> ${value}
              </div>
            `).join('')}
          </div>

          <p style="color: #555; line-height: 1.8; margin-top: 20px; font-size: 14px;">
            If you did not request these changes or have questions, please contact your administrator immediately.
          </p>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send user deletion notification email
export const sendUserDeletedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SyncBoard Account Has Been Deleted 🗑️',
      html: generateUserDeletedHTML(firstName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ User deletion email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending user deletion email:', error.message);
    throw error;
  }
};

// Send task assignment email
export const sendTaskAssignmentEmail = async (assigneeEmail, assigneeName, assignedByName, taskDetails) => {
  try {
    console.log('📧 Email Service - Starting to send task assignment email...');
    console.log('📧 Email User:', process.env.EMAIL_USER ? 'Configured ✓' : 'NOT CONFIGURED ✗');
    console.log('📧 Email Pass:', process.env.EMAIL_PASS ? 'Configured ✓' : 'NOT CONFIGURED ✗');
    console.log('📧 Recipient:', assigneeEmail);

    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to: assigneeEmail,
      subject: `New Task Assigned: ${taskDetails.title} 📋`,
      html: generateTaskAssignmentHTML(assigneeName, assignedByName, taskDetails),
    };

    console.log('📨 Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Task assignment email sent successfully to ${assigneeEmail}`);
    console.log(`✅ Message ID: ${info.messageId}`);
    console.log(`✅ Response: ${info.response}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending task assignment email:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

function generateTaskAssignmentHTML(assigneeName, assignedByName, taskDetails) {
  const currentYear = new Date().getFullYear();
  const { title, description, priority, status, dueDate, projectName } = taskDetails;

  const priorityColors = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#dc3545'
  };

  const priorityColor = priorityColors[priority] || '#6c757d';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; color: #333; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; font-weight: 600; }
        .message { color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
        .task-box {
          background: #f8f9ff;
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
        }
        .task-title {
          font-size: 20px;
          color: #333;
          font-weight: 700;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .task-description {
          color: #555;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
        }
        .task-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        .meta-item {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }
        .meta-label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 5px;
          font-weight: 600;
        }
        .meta-value {
          font-size: 14px;
          color: #333;
          font-weight: 600;
        }
        .priority-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          background: #e7f3ff;
          color: #0066cc;
          text-transform: capitalize;
        }
        .assigned-by {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 14px;
          color: #856404;
        }
        .cta-button { text-align: center; margin: 30px 0; }
        .cta-button a {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">📋 New Task Assigned</h1>
          <p style="color: #555;">You have a new task to work on</p>
        </div>
        <div class="content">
          <p class="greeting">Hi ${assigneeName}! 👋</p>
          <p class="message">
            <strong>${assignedByName}</strong> has assigned a new task to you in SyncBoard.
          </p>

          <div class="task-box">
            <div class="task-title">
              📝 ${title}
            </div>
            ${description ? `
            <div class="task-description">
              ${description}
            </div>
            ` : ''}

            <div class="task-meta">
              ${projectName ? `
              <div class="meta-item">
                <div class="meta-label">Project</div>
                <div class="meta-value">${projectName}</div>
              </div>
              ` : ''}
              <div class="meta-item">
                <div class="meta-label">Priority</div>
                <div class="meta-value">
                  <span class="priority-badge" style="background: ${priorityColor};">${priority}</span>
                </div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Status</div>
                <div class="meta-value">
                  <span class="status-badge">${status}</span>
                </div>
              </div>
              ${dueDate ? `
              <div class="meta-item">
                <div class="meta-label">Due Date</div>
                <div class="meta-value">${new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="assigned-by">
            <strong>👤 Assigned By:</strong> ${assignedByName}
          </div>

          <div class="cta-button">
            <a href="${FRONTEND_URL}/tasks">View Task in SyncBoard →</a>
          </div>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="${FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Visit SyncBoard</a> |
            <a href="${FRONTEND_URL}/help" style="color: #667eea; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you were assigned a task in SyncBoard.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateUserDeletedHTML(firstName) {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 700;
          color: white;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message-box {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-left: 4px solid #e74c3c;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .message-text {
          color: #666;
          font-size: 14px;
          line-height: 1.8;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333;">🗑️ Account Deleted</h1>
        </div>

        <div class="content">
          <p class="greeting" style="color: #333;">Hi ${firstName},</p>
          
          <p style="color: #555; line-height: 1.8; margin-bottom: 20px;">
            This email confirms that your SyncBoard account has been deleted from your organization.
          </p>

          <div class="message-box">
            <p class="message-text">
              <strong>Your Account Status:</strong><br>
              Your account has been permanently removed from the organization. All your projects, tasks, and access rights have been revoked.
            </p>
          </div>

          <p style="color: #555; line-height: 1.8; margin-top: 20px; font-size: 14px;">
            If you believe this is a mistake or need any assistance, please contact your organization administrator.
          </p>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because your account was deleted from SyncBoard.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generic sendEmail function
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"SyncBoard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};
