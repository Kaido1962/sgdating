// Email service using SendGrid
// For production, replace with your SendGrid API key in .env.local

interface EmailOptions {
    to: string
    subject: string
    html: string
    text: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
    // Check if SendGrid is configured
    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@sgdating.co.za'
    const fromName = process.env.SENDGRID_FROM_NAME || 'SG Dating App'

    if (!apiKey) {
        console.warn('SendGrid API key not configured. Email not sent:', { to, subject })
        console.log('Email content (HTML):', html)
        console.log('Email content (Text):', text)
        return false
    }

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: to }],
                        subject: subject,
                    },
                ],
                from: {
                    email: fromEmail,
                    name: fromName,
                },
                content: [
                    {
                        type: 'text/plain',
                        value: text,
                    },
                    {
                        type: 'text/html',
                        value: html,
                    },
                ],
                // Anti-spam settings
                mail_settings: {
                    bypass_list_management: {
                        enable: false,
                    },
                    footer: {
                        enable: false,
                    },
                    sandbox_mode: {
                        enable: process.env.NODE_ENV === 'development',
                    },
                },
                tracking_settings: {
                    click_tracking: {
                        enable: true,
                        enable_text: false,
                    },
                    open_tracking: {
                        enable: true,
                    },
                },
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('SendGrid API error:', error)
            return false
        }

        console.log('Email sent successfully to:', to)
        return true
    } catch (error) {
        console.error('Error sending email:', error)
        return false
    }
}

// Batch send emails (for event invitations)
export async function sendBatchEmails(emails: EmailOptions[]): Promise<{ sent: number; failed: number }> {
    let sent = 0
    let failed = 0

    // Send emails in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize)
        const results = await Promise.all(
            batch.map(email => sendEmail(email))
        )

        sent += results.filter(r => r).length
        failed += results.filter(r => !r).length

        // Wait a bit between batches to avoid rate limiting
        if (i + batchSize < emails.length) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    return { sent, failed }
}
