import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error.message);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

export const sendSignupEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to TaskFlow! 🚀 Your Account is Ready',
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
          color: white;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
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
        </div>

        <div class="content">
                  <h1> TaskFlow <br /> Your Intelligent Task Management Companion</h1>

          <p class="greeting">Hii, ${firstName}! 👋</p>
          
          <p class="message">
            Thank you for joining TaskFlow! We're thrilled to have you on board. Your account has been created successfully, 
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
            <a href="http://localhost:5173/login">Get Started Now →</a>
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
            © ${currentYear} TaskFlow. All rights reserved.<br>
            <a href="http://localhost:5173">Visit TaskFlow</a> | 
            <a href="http://localhost:5173/help">Help Center</a> | 
            <a href="http://localhost:5173/settings">Settings</a>
          </p>
          <div class="social-links">
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="LinkedIn">in</a>
            <a href="#" title="GitHub">gh</a>
          </div>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you signed up for TaskFlow.
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
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your TaskFlow Password 🔐',
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
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p class="greeting">Hi ${firstName},</p>
          <p>We received a request to reset your TaskFlow password.</p>
          <p>Click the button below to reset your password. This link is valid for <strong>1 hour</strong>:</p>
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
          <p>© ${new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const sendAccountDeletedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your TaskFlow Account Has Been Deleted 👋',
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
          <h1>Account Deleted</h1>
        </div>

        <div class="content">
          <p class="greeting">Hi ${firstName},</p>
          
          <p class="message">
            This email confirms that your TaskFlow account has been permanently deleted. All your data, tasks, and settings have been removed from our servers.
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
            <strong>Miss TaskFlow?</strong> You can always create a new account with the same email address anytime. We'll be glad to have you back!
          </p>

          <!-- Support -->
          <div class="support-link">
            <p style="font-size: 13px; color: #555; margin-bottom: 10px;">Have questions or need help?</p>
            <a href="http://localhost:5173/help">Contact Support</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} TaskFlow. All rights reserved.<br>
            <a href="http://localhost:5173">Visit TaskFlow</a> | 
            <a href="http://localhost:5173/help">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you deleted your TaskFlow account.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
