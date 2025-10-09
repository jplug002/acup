# Admin User Management Setup Guide

This guide will help you configure the email and SMS functionality for the ACUP admin dashboard.

## Features

The admin dashboard now includes:
- **User Management**: View all registered users with their details
- **Email Messaging**: Send emails to individual users or all users via Gmail SMTP
- **SMS Messaging**: Send SMS to individual users or all users via Africa's Talking API
- **Personalization**: Use `{name}` in messages to personalize with recipient names

## Environment Variables Setup

### 1. Gmail SMTP Configuration (for Emails)

To send emails via Gmail, you need to set up an App Password:

#### Steps:
1. Go to your [Google Account settings](https://myaccount.google.com)
2. Enable **2-Step Verification** (Security > 2-Step Verification)
3. Go to **Security > App passwords**
4. Select **Mail** and generate a new app password
5. Copy the 16-character password (remove spaces)

#### Add to your `.env` file:
\`\`\`env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="abcd efgh ijkl mnop"  # Your 16-character app password
\`\`\`

**Important Notes:**
- Use your Gmail address for `SMTP_USER`
- Use the App Password (NOT your regular Gmail password) for `SMTP_PASSWORD`
- Emails will be sent from "ACUP <your-email@gmail.com>"

---

### 2. Africa's Talking SMS Configuration

To send SMS via Africa's Talking:

#### Steps:
1. Sign up at [Africa's Talking](https://africastalking.com)
2. Go to **Dashboard > Settings**
3. Copy your **Username** and **API Key**

#### For Testing (Sandbox):
\`\`\`env
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="your-sandbox-api-key"
\`\`\`

#### For Production:
\`\`\`env
AFRICASTALKING_USERNAME="your-production-username"
AFRICASTALKING_API_KEY="your-production-api-key"
\`\`\`

**Important Notes:**
- Sandbox mode is free but has limitations
- Phone numbers must include country code (e.g., `+256700000000`)
- SMS sender ID "ACUP" must be registered with Africa's Talking for production
- To register sender ID: Go to Dashboard > SMS > Sender IDs

---

## How to Use

### Accessing the Admin Users Page

1. Log in to the admin dashboard at `/admin`
2. Click on the **"Users"** card or navigate to `/admin/users`
3. You'll see a table of all registered users

### Sending Emails

#### To a Single User:
1. Find the user in the table
2. Click **"Send Email"** button next to their name
3. Enter the subject and message
4. Click **"Send Email"**

#### To All Users:
1. Click **"📧 Email All"** button at the top
2. Enter the subject and message
3. Use `{name}` to personalize (e.g., "Dear {name},")
4. Click **"Send Email"**

### Sending SMS

#### To a Single User:
1. Find the user in the table (must have a phone number)
2. Click **"Send SMS"** button next to their name
3. Enter your message (max 160 characters)
4. Click **"Send SMS"**

#### To All Users:
1. Click **"💬 SMS All"** button at the top
2. Enter your message (max 160 characters)
3. Use `{name}` to personalize (e.g., "Hi {name},")
4. Click **"Send SMS"**

---

## Troubleshooting

### Email Issues

**Error: "SMTP credentials not configured"**
- Make sure `SMTP_USER` and `SMTP_PASSWORD` are set in your `.env` file
- Restart your development server after adding environment variables

**Error: "Invalid login"**
- You're using your regular Gmail password instead of an App Password
- Generate a new App Password and use that instead

**Error: "Less secure app access"**
- Gmail no longer supports "less secure apps"
- You MUST use an App Password (see setup steps above)

### SMS Issues

**Error: "Africa's Talking API key not configured"**
- Make sure `AFRICASTALKING_API_KEY` is set in your `.env` file
- Restart your development server

**Error: "Invalid phone number format"**
- Phone numbers must start with `+` and include country code
- Example: `+256700000000` (Uganda), `+254700000000` (Kenya)
- Users need to add their phone numbers in their profile

**Error: "Sender ID not registered"**
- In production, you need to register "ACUP" as a sender ID
- Go to Africa's Talking Dashboard > SMS > Sender IDs
- Submit "ACUP" for approval (takes 1-2 business days)

---

## Phone Number Requirements

For SMS to work, users must:
1. Add their phone number in their profile
2. Include the country code (e.g., `+256700000000`)
3. Format: `+[country code][phone number]`

**Supported Countries:**
- Uganda: `+256`
- Kenya: `+254`
- Tanzania: `+255`
- Rwanda: `+250`
- And more (check Africa's Talking coverage)

---

## Cost Information

### Gmail SMTP
- **Free** for personal Gmail accounts
- Daily sending limit: 500 emails/day
- For higher volumes, consider Google Workspace or a dedicated email service

### Africa's Talking SMS
- **Sandbox**: Free with limitations (test numbers only)
- **Production**: Pay-as-you-go pricing
  - Uganda: ~$0.01 per SMS
  - Kenya: ~$0.01 per SMS
  - Prices vary by country
- Check [Africa's Talking Pricing](https://africastalking.com/pricing) for details

---

## Security Best Practices

1. **Never commit `.env` file to Git**
   - It's already in `.gitignore`
   - Use `.env.example` as a template

2. **Use strong passwords**
   - Generate secure App Passwords
   - Keep API keys secret

3. **Limit admin access**
   - Only trusted admins should access `/admin/users`
   - Consider adding role-based access control

4. **Monitor usage**
   - Check Gmail sent folder for email logs
   - Monitor Africa's Talking dashboard for SMS usage and costs

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for detailed error information
3. Verify all environment variables are set correctly
4. Restart your development server after changing `.env`

For Africa's Talking support: [support@africastalking.com](mailto:support@africastalking.com)
For Gmail issues: [Google Account Help](https://support.google.com/accounts)
