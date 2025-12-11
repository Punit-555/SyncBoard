# SendGrid Setup Guide for SyncBoard

## Why SendGrid?

Your current issue: **Render's free tier blocks Gmail SMTP connections**, causing email timeouts.

**Solution**: SendGrid works perfectly on Render free tier and offers 100 free emails/day.

---

## Step-by-Step Setup (10 minutes)

### 1. Create SendGrid Account

1. Go to **https://sendgrid.com/**
2. Click **"Start for Free"** (top right)
3. Fill in the signup form:
   - Email: Use your work email
   - Password: Create a strong password
   - Company: QSS Technosoft (or your company name)
4. Click **"Create Account"**
5. **Check your email** and click the verification link
6. Complete the getting started questions (you can skip or fill quickly)

### 2. Create SendGrid API Key

1. After logging in, go to **Settings** → **API Keys** (left sidebar)
2. Click **"Create API Key"** (blue button, top right)
3. Fill in the form:
   - **API Key Name**: `SyncBoard-Production`
   - **API Key Permissions**: Select **"Restricted Access"**
     - Expand **"Mail Send"** section
     - Toggle **"Mail Send"** to **ON** (blue)
4. Click **"Create & View"**
5. **IMPORTANT**: Copy the API key NOW!
   ```
   It looks like: SG.xxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   **You'll only see this once!** Save it in a safe place.

6. Click **"Done"**

### 3. Verify Sender Email Address

SendGrid requires sender verification to prevent spam:

1. Go to **Settings** → **Sender Authentication** (left sidebar)
2. Under **"Single Sender Verification"**, click **"Get Started"** or **"Create New Sender"**
3. Fill in the form:
   ```
   From Name: SyncBoard
   From Email Address: codesharma452@gmail.com
   Reply To: codesharma452@gmail.com

   Company Address:
   Address Line 1: Your company address
   City: Your city
   State: Your state
   Zip Code: Your zip
   Country: India

   Nickname: SyncBoard Notifications
   ```
4. Click **"Create"**
5. **Check your email inbox** (codesharma452@gmail.com)
6. Find the email from SendGrid: "Please Verify Your Single Sender"
7. Click the **"Verify Single Sender"** button in the email
8. You'll see a success message

**Status**: Your sender email is now verified! ✅

### 4. Add SendGrid API Key to Render

1. Go to **https://dashboard.render.com/**
2. Click on your **backend service** (syncboard-2397 or similar)
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"**
5. Add the following:
   ```
   Key:   SENDGRID_API_KEY
   Value: [Paste your API key from Step 2]
   ```
   (Example: `SG.xxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
6. Click **"Save Changes"**

**Render will automatically redeploy your service** (takes 2-3 minutes)

### 5. Verify It's Working

#### Check Render Logs:

1. While on your Render service page, click **"Logs"** tab
2. Wait for deployment to complete
3. Look for these log messages:

**✅ Success - You should see:**
```
📧 Email Service Configuration: {
  service: 'SendGrid',
  user: 'cod***',
  sendGridConfigured: true,
  gmailConfigured: true,
  frontendUrl: 'https://sync-board-frontend-ivory.vercel.app'
}
📧 Using SendGrid for email delivery
✅ Email service (SendGrid) is ready to send messages
```

**❌ If you see an error:**
```
❌ Email transporter verification failed
⚠️ SendGrid issue - Please check:
   1. SENDGRID_API_KEY environment variable is set correctly
   2. API key has "Mail Send" permissions
   3. Sender email is verified in SendGrid
```
- Double-check your API key is correct
- Ensure sender email is verified
- Make sure API key has "Mail Send" permission

### 6. Test Email Sending

1. Go to your SyncBoard app: **https://sync-board-frontend-ivory.vercel.app**
2. Log in as admin
3. Go to **Users** page
4. Click **"Create User"**
5. Fill in the form with a test email (use your personal email)
6. Click **"Create"**

#### Check Results:

**In Render Logs:**
```
➕ Creating new user: test@example.com
✅ User created: test@example.com
✅ Welcome email with password sent to test@example.com
```

**In Email Inbox:**
- Check your inbox (and spam folder)
- You should receive: "Welcome to SyncBoard! 🚀 Your Account is Ready"
- Email will have the temporary password

### 7. Monitor Email Activity (Optional)

1. In SendGrid dashboard, go to **Activity** (left sidebar)
2. You'll see all sent emails with status:
   - ✅ **Delivered**: Email successfully sent
   - 📬 **Processed**: Email in queue
   - ⚠️ **Bounced**: Invalid email address
   - 🚫 **Dropped**: Spam or invalid

---

## Troubleshooting

### Issue: Emails not arriving

**Check 1: Spam Folder**
- SendGrid emails sometimes go to spam initially
- Mark as "Not Spam" to train Gmail

**Check 2: SendGrid Activity**
- Go to SendGrid → Activity
- Check if email shows as "Delivered"
- If "Bounced" or "Dropped", check the reason

**Check 3: Render Logs**
- Look for error messages
- Common issues:
  - Invalid API key
  - Sender not verified
  - API key lacks permissions

### Issue: "Connection timeout" still appearing

**Solution:**
- Make sure you added `SENDGRID_API_KEY` to Render (not just locally)
- Wait for Render to finish redeploying (2-3 minutes)
- Check logs for "Using SendGrid for email delivery"

### Issue: "Invalid API key"

**Solution:**
- API keys can only be viewed once during creation
- If you lost it, create a new API key in SendGrid
- Delete the old one for security
- Update the environment variable on Render

---

## SendGrid Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Emails per day | 100 |
| Emails per month | 3,000 |
| Sender verification | Unlimited |
| Email templates | Yes |
| Analytics | Yes |
| Support | Email only |

**Note**: 100 emails/day is usually enough for small to medium apps. If you need more, SendGrid has paid plans starting at $15/month for 40,000 emails.

---

## Production Checklist

- [ ] SendGrid account created and verified
- [ ] API key created with "Mail Send" permission
- [ ] Sender email (codesharma452@gmail.com) verified
- [ ] `SENDGRID_API_KEY` added to Render environment variables
- [ ] Render service redeployed successfully
- [ ] Logs show "Using SendGrid for email delivery"
- [ ] Test email sent and received
- [ ] Production emails working

---

## Alternative: If You Want to Keep Using Gmail

If you prefer Gmail, you need to upgrade Render to a paid plan ($7/month) which removes SMTP restrictions:

1. Go to Render Dashboard → Billing
2. Upgrade to **Starter Plan** ($7/month)
3. Remove `SENDGRID_API_KEY` from environment variables
4. Gmail SMTP will work automatically

**Comparison:**
- SendGrid Free: $0/month, 100 emails/day
- Render Starter + Gmail: $7/month, unlimited emails

---

## Support

If you encounter any issues:

1. **SendGrid Documentation**: https://docs.sendgrid.com/
2. **SendGrid Support**: https://support.sendgrid.com/
3. **Check Render Logs**: Look for specific error messages
4. **Test locally**: SendGrid works in local development too

---

## Next Steps After Setup

Once emails are working:

1. Monitor SendGrid activity for deliverability
2. Consider setting up email templates in SendGrid (optional)
3. Add your company logo to emails (optional)
4. Set up DKIM/SPF for better deliverability (optional, advanced)

---

**Created**: December 11, 2025
**For**: SyncBoard Production Deployment
**Developer**: Punit
