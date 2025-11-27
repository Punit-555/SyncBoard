# 📧 Email Configuration Guide for TaskFlow

## ⚠️ IMPORTANT: Gmail App Password Setup

Your current email configuration is **NOT working** because Gmail requires a special **App Password**, not your regular Gmail password.

### 🔧 Steps to Enable Gmail Sending:

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" and complete the setup
   - You must have 2FA enabled to create App Passwords

2. **Create App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select: App = Mail, Device = Windows Computer (or your device)
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env File**
   ```
   EMAIL_USER=codesharma452@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # (Use the 16-char password from step 2)
   ```

4. **Restart Server**
   ```bash
   npm start
   # OR for development:
   npm run dev
   ```

### ✅ Testing Email Sending

Use curl or Postman to test signup:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Check server logs - you should see:
```
✅ Email service is ready to send messages
✅ Signup email sent to test@example.com. Message ID: <xxxx>
```

### 🔒 Alternative: Use Environment Variables

Instead of storing credentials in .env:
```bash
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
npm start
```

### 📧 Email Features

The new email template includes:
- ✨ Beautiful gradient design with TaskFlow branding
- 📋 Feature highlights showing what users can do
- 💡 Pro tips for productivity
- 🔗 Links to app features
- 📱 Responsive design (mobile-friendly)
- 🚀 Call-to-action button to get started

### 🐛 Troubleshooting

**Email not sending?**
- Check EMAIL_USER is correct
- Verify EMAIL_PASS is the App Password (not regular password)
- Ensure 2FA is enabled on Gmail account
- Check server logs for error messages
- Verify database connection is working

**Wrong sender name?**
- The email shows "TaskFlow <your-email@gmail.com>" as sender
- Update the FROM field in emailService.js if needed

**Want different email provider?**
- See emailService.js for example configuration
- Supported: Gmail, Outlook, SendGrid, Mailgun, etc.

