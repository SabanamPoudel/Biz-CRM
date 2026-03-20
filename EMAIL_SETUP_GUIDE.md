# 📧 Email Setup Guide for Magic Link

The email functionality is now implemented! Follow these steps to configure it:

## ✅ What's Been Done

1. ✅ Installed `nodemailer` package
2. ✅ Created `EmailService` with beautiful email templates
3. ✅ Updated `AuthService` to send real emails
4. ✅ Added email configuration to `.env`

## 🔧 Setup Instructions

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Update `.env` file** in `apps/backend/.env`:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-char-app-password"
   SMTP_FROM="BizzCRM <your-email@gmail.com>"
   ```

4. **Restart your backend server**
   ```bash
   cd apps/backend
   pnpm run start:dev
   ```

### Option 2: Using Other Email Services

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="noreply@yourdomain.com"
```

#### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
SMTP_FROM="BizzCRM <your-email@outlook.com>"
```

#### Custom SMTP Server
```env
SMTP_HOST="smtp.yourdomain.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-username"
SMTP_PASS="your-password"
SMTP_FROM="noreply@yourdomain.com"
```

## 🧪 Testing

1. **Update your `.env` file** with your email credentials
2. **Restart the backend server**
3. **Go to** http://localhost:3001/login/magic-link
4. **Enter your email** and click "Send magic link"
5. **Check your email inbox** for the magic link

## 📧 Email Features

The magic link email includes:
- ✨ Beautiful HTML design matching your brand
- 🔒 Security notice about expiration
- ⏰ 15-minute expiration time
- 🔗 Clickable button + copy-paste link
- 📱 Mobile-responsive design

## ⚠️ Important Notes

- **App Passwords**: For Gmail, you MUST use an app password, not your regular password
- **2FA Required**: Gmail requires 2-Factor Authentication to generate app passwords
- **Fallback**: If email sending fails, the link will still be logged in the console for development
- **Security**: Never commit your `.env` file with real credentials to git

## 🐛 Troubleshooting

### "Invalid login" error with Gmail
- Make sure you're using an **App Password**, not your Gmail password
- Verify 2FA is enabled on your account

### Emails not sending
- Check your `.env` configuration
- Verify SMTP credentials are correct
- Check the backend console for error messages

### Emails going to spam
- Use a proper "From" address
- Consider using a dedicated email service like SendGrid in production
- Add SPF and DKIM records to your domain

## 🚀 Production Recommendations

For production, consider using:
- **SendGrid** (12,000 free emails/month)
- **AWS SES** (62,000 free emails/month)
- **Resend** (Modern, developer-friendly)
- **Mailgun** (Enterprise-grade)

These services provide better deliverability, analytics, and reliability than SMTP.
