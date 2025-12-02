import dotenv from 'dotenv';
import { sendTaskAssignmentEmail } from './services/emailService.js';

dotenv.config();

// Test email configuration
console.log('🧪 Testing Email Configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Configured' : '✗ NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Configured' : '✗ NOT SET');
console.log('\n');

// Test sending an email
const testEmail = async () => {
  try {
    console.log('📧 Sending test email...\n');

    await sendTaskAssignmentEmail(
      'recipient@example.com', // Change this to your test email
      'Test User',
      'Admin User',
      {
        title: 'Test Task',
        description: 'This is a test task to verify email functionality',
        priority: 'high',
        status: 'todo',
        dueDate: new Date(),
        projectName: 'Test Project'
      }
    );

    console.log('\n✅ Test email sent successfully!');
    console.log('Check the recipient inbox.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

testEmail();
