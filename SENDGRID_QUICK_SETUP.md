# SendGrid Quick Setup (5 Minutes)

## Why?
Render free tier blocks Gmail SMTP → Use SendGrid instead (100 free emails/day)

---

## Quick Steps

### 1️⃣ Create Account
- Go to: https://sendgrid.com/
- Click "Start for Free"
- Verify your email

### 2️⃣ Get API Key
- Settings → API Keys → Create API Key
- Name: `SyncBoard-Production`
- Permission: **Restricted Access** → Enable **"Mail Send"**
- Copy the key: `SG.xxxxx...xxxxx`

### 3️⃣ Verify Sender Email
- Settings → Sender Authentication → Create New Sender
- Use: `codesharma452@gmail.com`
- Check email and click verification link

### 4️⃣ Add to Render
- Render Dashboard → Your Service → Environment
- Add variable:
  ```
  SENDGRID_API_KEY = [paste your API key]
  ```
- Save (auto-redeploys)

### 5️⃣ Verify
Check Render logs for:
```
✅ Email service (SendGrid) is ready to send messages
```

### 6️⃣ Test
- Create a user in your app
- Check email inbox (and spam folder)

---

## What Changed in Code?

The code automatically uses SendGrid when `SENDGRID_API_KEY` is present:
- **Production (Render)**: Uses SendGrid ✅
- **Local Development**: Uses Gmail ✅
- **No code changes needed!** Just add the API key.

---

## Important Notes

✅ **Free Tier**: 100 emails/day (3,000/month)
✅ **No Credit Card**: Required for signup
✅ **Works on Render**: Free tier compatible
⚠️ **Sender Verification**: Required before sending
⚠️ **API Key**: Only shown once - save it!

---

## Troubleshooting

**Emails not arriving?**
1. Check spam folder
2. Verify sender email is confirmed (green checkmark in SendGrid)
3. Check SendGrid → Activity to see delivery status

**Still seeing connection timeout?**
1. Ensure `SENDGRID_API_KEY` is added to **Render** (not just local .env)
2. Wait 2-3 minutes for Render to redeploy
3. Check logs for "Using SendGrid for email delivery"

---

**Full Guide**: See `SENDGRID_SETUP.md` for detailed instructions
