// Email template functions with SG Dating App branding
// Colors: #a22929 (primary red), #ae645c (secondary), #242228 (dark)

const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f5f5;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #a22929 0%, #ae645c 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .logo {
    width: 60px;
    height: 60px;
    background-color: white;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #a22929;
  }
  .header-title {
    color: white;
    font-size: 28px;
    font-weight: bold;
    margin: 0;
  }
  .content {
    padding: 40px 30px;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #a22929 0%, #ae645c 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    margin: 20px 0;
  }
  .footer {
    background-color: #242228;
    color: #999;
    padding: 30px;
    text-align: center;
    font-size: 12px;
  }
  .footer a {
    color: #ae645c;
    text-decoration: none;
  }
`

export function generateVerificationEmail(verificationLink: string, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - SG Dating App</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SG</div>
          <h1 class="header-title">Verify Your Email</h1>
        </div>
        <div class="content">
          <h2 style="color: #242228; margin-top: 0;">Hi ${userName}! 👋</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Welcome to SG Dating App! We're excited to have you join our community of singles looking for meaningful connections.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            To get started, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" class="button">Verify My Email</a>
          </div>
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationLink}" style="color: #a22929; word-break: break-all;">${verificationLink}</a>
          </p>
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            This link will expire in 24 hours for security reasons.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2026 SG Dating App. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="https://sgdating.co.za/privacy">Privacy Policy</a> • 
            <a href="https://sgdating.co.za/terms">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateWelcomeEmail(userName: string, userEmail: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SG Dating App!</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SG</div>
          <h1 class="header-title">Welcome to SG Dating! 🎉</h1>
        </div>
        <div class="content">
          <h2 style="color: #242228; margin-top: 0;">Hey ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your email has been verified successfully! You're now part of South Africa's premier dating community.
          </p>
          <h3 style="color: #a22929; margin-top: 30px;">What's Next?</h3>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; color: #666;">
              ✨ <strong>Complete your profile</strong> - Add photos and tell us about yourself
            </p>
            <p style="margin: 0 0 15px 0; color: #666;">
              💝 <strong>Start matching</strong> - Discover people who share your interests
            </p>
            <p style="margin: 0 0 15px 0; color: #666;">
              💬 <strong>Connect & chat</strong> - Send messages and build connections
            </p>
            <p style="margin: 0; color: #666;">
              🌟 <strong>Join communities</strong> - Find groups that match your hobbies
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
              Go to Dashboard
            </a>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/help" style="color: #a22929;">Help Center</a> or reply to this email.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2026 SG Dating App. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="https://sgdating.co.za/privacy">Privacy Policy</a> • 
            <a href="https://sgdating.co.za/terms">Terms of Service</a> • 
            <a href="mailto:support@sgdating.co.za">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateEventInvitationEmail(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  eventDescription: string,
  eventLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited: ${eventTitle}</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SG</div>
          <h1 class="header-title">You're Invited! 🎊</h1>
        </div>
        <div class="content">
          <h2 style="color: #242228; margin-top: 0;">Hi ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You've been invited to an exciting event on SG Dating App!
          </p>
          
          <div style="background: linear-gradient(135deg, #a22929 0%, #ae645c 100%); padding: 25px; border-radius: 12px; margin: 25px 0; color: white;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">${eventTitle}</h2>
            <p style="margin: 0 0 10px 0; opacity: 0.9;">
              📅 ${eventDate}
            </p>
            <p style="margin: 0; opacity: 0.9;">
              📍 ${eventLocation}
            </p>
          </div>

          <h3 style="color: #242228; margin-top: 25px;">About This Event</h3>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ${eventDescription}
          </p>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${eventLink}" class="button">View Event Details</a>
          </div>

          <p style="color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
            Don't miss out on this opportunity to connect with other singles!
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2026 SG Dating App. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="https://sgdating.co.za/unsubscribe">Unsubscribe from event notifications</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Plain text versions for email clients that don't support HTML
export function generateVerificationEmailText(verificationLink: string, userName: string): string {
  return `
Hi ${userName}!

Welcome to SG Dating App! We're excited to have you join our community.

To get started, please verify your email address by clicking this link:
${verificationLink}

This link will expire in 24 hours for security reasons.

If you didn't create an account, please ignore this email.

---
© 2026 SG Dating App
  `.trim()
}

export function generateWelcomeEmailText(userName: string): string {
  return `
Hey ${userName}!

Your email has been verified successfully! You're now part of South Africa's premier dating community.

What's Next?
- Complete your profile - Add photos and tell us about yourself
- Start matching - Discover people who share your interests
- Connect & chat - Send messages and build connections
- Join communities - Find groups that match your hobbies

Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard

Need help? Reply to this email or visit our Help Center.

---
© 2026 SG Dating App
  `.trim()
}

export function generateEventInvitationEmailText(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  eventDescription: string,
  eventLink: string
): string {
  return `
Hi ${userName}!

You've been invited to an exciting event on SG Dating App!

EVENT: ${eventTitle}
DATE: ${eventDate}
LOCATION: ${eventLocation}

${eventDescription}

View event details: ${eventLink}

Don't miss out on this opportunity to connect with other singles!

---
© 2026 SG Dating App
Unsubscribe from event notifications: https://sgdating.co.za/unsubscribe
  `.trim()
}
// ... (previous content)

export function generateOTPEmail(verificationCode: string, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - SG Dating App</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SG</div>
          <h1 class="header-title">Verification Code 🔐</h1>
        </div>
        <div class="content">
          <h2 style="color: #242228; margin-top: 0;">Hi ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for joining SG Dating App. Use the code below to verify your email address:
          </p>
          
          <div style="background-color: #f0f0f0; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
            <p style="margin: 10px 0 0 0; color: #a22929; font-size: 32px; font-weight: bold; letter-spacing: 5px;">${verificationCode}</p>
          </div>

          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            This code will expire in 15 minutes.
          </p>
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2026 SG Dating App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateOTPEmailText(verificationCode: string, userName: string): string {
  return `
Hi ${userName}!

Use the code below to verify your email address for SG Dating App:

YOUR CODE: ${verificationCode}

This code will expire in 15 minutes.

---
© 2026 SG Dating App
  `.trim()
}
