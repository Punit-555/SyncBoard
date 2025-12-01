import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔧 Testing Email Configuration...\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
console.log(`🔑 Email Pass: ${process.env.EMAIL_PASS ? '••••••••••••••••' : 'NOT SET'}\n`);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email Configuration Failed!');
    console.error('\n📌 Error Details:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}\n`);
    
    if (error.code === 'EAUTH' || error.response?.includes('Application-specific password')) {
      console.error('🔴 ISSUE: Application-specific password required!');
      console.error('\n✅ SOLUTION:');
      console.error('1. Go to: https://myaccount.google.com/apppasswords');
      console.error('2. Select "Mail" and your device');
      console.error('3. Generate a new app password (16 characters)');
      console.error('4. Copy and paste it in .env as EMAIL_PASS');
      console.error('5. Restart the server\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔴 ISSUE: Cannot connect to Gmail SMTP server');
      console.error('   Check your internet connection\n');
    } else if (error.message?.includes('Invalid login')) {
      console.error('🔴 ISSUE: Invalid email or password');
      console.error('   Check EMAIL_USER and EMAIL_PASS in .env file\n');
    }
    
    process.exit(1);
  } else {
    console.log('✅ Email Service Ready!');
    console.log('   SMTP connection verified successfully\n');
    
    // Send test email
    const testEmail = {
      from: `"TaskFlow Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '✅ TaskFlow Email Test - Success!',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✅ Email Configuration Working!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Great news! Your TaskFlow email service is configured and working correctly.
            </p>
            <div style="background: white; padding: 20px; border-left: 4px solid #28a745; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #155724; font-weight: 600;">✓ Configuration Verified</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Your server can now send signup welcome emails, password reset emails, and notifications.</p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              You're all set! Your users will now receive beautiful TaskFlow welcome emails when they sign up.
            </p>
          </div>
        </div>
      `,
    };
    
    transporter.sendMail(testEmail, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:');
        console.error(`   ${error.message}\n`);
        process.exit(1);
      } else {
        console.log('✅ Test Email Sent!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Check your inbox at: ${process.env.EMAIL_USER}\n`);
        console.log('🎉 Everything is ready! Your email service is fully configured.\n');
        process.exit(0);
      }
    });
  }
});
