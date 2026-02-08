import sgMail from "@sendgrid/mail";
import { logger } from "./logger";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@nexus-analytics.app";
const SENDER_NAME = "Nexus Analytics";

if (!SENDGRID_API_KEY) {
  logger.warn("SendGrid API key not found in environment variables");
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface MessageProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
  category?: string;
}

export class EmailService {
  /**
   * Centralized base template for all emails to ensure deliverability and compliance
   */
  static getBaseTemplate(title: string, contentHtml: string, ctaHtml?: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #1f2937; line-height: 1.6; margin: 0; padding: 0; background-color: #f3f4f6; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; font-size: 16px; color: #374151; }
            .footer { text-align: center; padding: 30px; color: #6b7280; font-size: 12px; }
            .cta-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background-color: #3b82f6; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
            p { margin: 0 0 20px 0; }
            .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
            .address { font-style: normal; margin-top: 10px; }
            .unsubscribe { color: #3b82f6; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>${title}</h1>
              </div>
              <div class="content">
                ${contentHtml}
                ${ctaHtml ? `<div class="cta-container">${ctaHtml}</div>` : ''}
              </div>
              <div class="footer">
                <p>Nexus Analytics &bull; 123 Analytics Way, San Francisco, CA 94103</p>
                <div class="address">
                  You are receiving this because you signed up for Nexus Analytics.
                  <br>
                  <a href="https://nexus-analytics.app/dashboard/settings" class="unsubscribe">Unsubscribe</a> or 
                  <a href="https://nexus-analytics.app/dashboard/settings" class="unsubscribe">Manage Preferences</a>
                </div>
                <p style="margin-top: 20px;">© 2026 Nexus. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static async sendMail(
    data: MessageProps,
  ): Promise<{ success: boolean; error?: string }> {
    if (!SENDGRID_API_KEY) {
      logger.error("Cannot send email: SendGrid not configured");
      return { success: false, error: "Email service not configured" };
    }

    try {
      await sgMail.send({
        to: data.to,
        from: {
          email: SENDER_EMAIL,
          name: SENDER_NAME,
        },
        subject: data.subject,
        text: data.text,
        html: data.html || data.text,
        headers: {
          'List-Unsubscribe': '<https://nexus-analytics.app/dashboard/settings>, <mailto:unsubscribe@nexus-analytics.app?subject=unsubscribe>',
          'X-Entity-Ref-ID': Date.now().toString(),
        },
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
        categories: data.category ? [data.category] : undefined,
      });
      logger.info(`Email sent to ${data.to} [Category: ${data.category || 'none'}]`);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Error sending email: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  static async sendVerificationCode(
    email: string,
    code: string,
  ): Promise<void> {
    const subject = "Verify your email address";
    const text = `Thank you for signing up! Please verify your email address by entering the following code: ${code}\n\nThis code will expire in 5 minutes.`;
    
    const contentHtml = `
      <p>Thank you for signing up! To get started with Nexus Analytics, please verify your email address by entering the code below:</p>
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 30px; text-align: center; font-size: 36px; font-weight: 800; letter-spacing: 0.2em; margin: 30px 0; border-radius: 12px; color: #3b82f6; font-family: monospace;">
        ${code}
      </div>
      <p>This code will expire in <strong>5 minutes</strong> for your security.</p>
      <p>If you did not request this code, you can safely ignore this email.</p>
    `;

    const html = this.getBaseTemplate(
      "Welcome to Nexus",
      contentHtml
    );

    await this.sendMail({ 
      to: email, 
      subject, 
      text, 
      html,
      category: 'verification'
    });
  }
}
